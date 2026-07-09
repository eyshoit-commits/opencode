import * as http from "node:http"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { startReviewGateServer } from "../src/review-gate/server.js"

describe("review gate server", () => {
  let server: { url: string; close: () => Promise<void> }

  beforeEach(async () => {
    server = await startReviewGateServer({ port: 0 })
  })

  afterEach(async () => {
    await server.close()
  })

  async function request(path: string, init?: RequestInit): Promise<{ status: number; body: unknown }> {
    return new Promise((resolve, reject) => {
      const url = new URL(path, server.url)
      const req = http.request(
        url,
        {
          method: init?.method ?? "GET",
          headers: init?.headers as Record<string, string>,
        },
        (res) => {
          const chunks: Buffer[] = []
          res.on("data", (chunk) => chunks.push(chunk))
          res.on("end", () => {
            const text = chunks.toString()
            let body: unknown
            try {
              body = text ? JSON.parse(text) : null
            } catch {
              body = text
            }
            resolve({ status: res.statusCode ?? 0, body })
          })
        },
      )
      req.on("error", reject)
      if (init?.body) req.write(init.body as string)
      req.end()
    })
  }

  it("serves the review gate HTML", async () => {
    const res = await request("/")
    expect(res.status).toBe(200)
    expect(typeof res.body).toBe("string")
    expect(res.body).toContain("BKG Review Gate")
  })

  it("creates a review session via POST", async () => {
    const res = await request("/api/review/open", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Test", content: "diff", trigger: "blocker" }),
    })

    expect(res.status).toBe(201)
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "Test",
        status: "pending",
      }),
    )
  })

  it("reads a review session", async () => {
    const created = await request("/api/review/open", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Read", content: "c", trigger: "blocker" }),
    })

    const res = await request(`/api/review/${(created.body as { id: string }).id}`)
    expect(res.status).toBe(200)
    expect((res.body as { title: string }).title).toBe("Read")
  })

  it("adds an annotation", async () => {
    const created = await request("/api/review/open", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Annotate", content: "c", trigger: "blocker" }),
    })

    const id = (created.body as { id: string }).id
    const res = await request(`/api/review/${id}/annotation`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ target: "line-1", comment: "needs work" }),
    })

    expect(res.status).toBe(201)
    expect((res.body as { annotations: unknown[] }).annotations).toHaveLength(1)
  })

  it("approves a review session", async () => {
    const created = await request("/api/review/open", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Approve", content: "c", trigger: "blocker" }),
    })

    const id = (created.body as { id: string }).id
    const res = await request(`/api/review/${id}/approve`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ comment: "LGTM" }),
    })

    expect(res.status).toBe(200)
    expect((res.body as { status: string }).status).toBe("approved")
  })

  it("rejects a review session", async () => {
    const created = await request("/api/review/open", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Reject", content: "c", trigger: "blocker" }),
    })

    const id = (created.body as { id: string }).id
    const res = await request(`/api/review/${id}/reject`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ comment: "Needs fixes" }),
    })

    expect(res.status).toBe(200)
    expect((res.body as { status: string }).status).toBe("rejected")
  })

  it("returns 400 for unknown review id", async () => {
    const res = await request("/api/review/unknown")
    expect(res.status).toBe(400)
  })

  it("returns 404 for unknown action", async () => {
    const created = await request("/api/review/open", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "t", content: "c", trigger: "blocker" }),
    })

    const id = (created.body as { id: string }).id
    const res = await request(`/api/review/${id}/unknown`)
    expect(res.status).toBe(404)
  })
})
