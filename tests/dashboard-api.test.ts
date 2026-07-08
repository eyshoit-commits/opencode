import { describe, expect, it } from "vitest"
import { handleDashboardApi } from "../src/dashboard/api"

function request(path: string, init?: RequestInit): Request {
  return new Request(`http://127.0.0.1${path}`, init)
}

function body(response: { body: string } | null): unknown {
  return response ? JSON.parse(response.body) : null
}

describe("dashboard API", () => {
  it("returns the complete dashboard state", async () => {
    const response = await handleDashboardApi(request("/api/state"))

    expect(response?.status).toBe(200)
    expect(body(response)).toEqual(
      expect.objectContaining({
        blockers: expect.any(Array),
        ratSessions: expect.any(Array),
        votes: expect.any(Array),
        memories: expect.any(Array),
        sync: expect.any(Object),
        liveOutput: expect.any(Object),
      }),
    )
  })

  it("returns a text summary", async () => {
    const response = await handleDashboardApi(request("/api/summary"))

    expect(response?.status).toBe(200)
    expect(body(response)).toEqual(
      expect.objectContaining({
        summary: expect.any(String),
        state: expect.any(Object),
      }),
    )
  })

  it.each([
    "/api/blocker",
    "/api/rat/start",
    "/api/vote",
    "/api/user/approve",
    "/api/user/reject",
    "/api/user/revise",
  ])("validates malformed POST requests for %s", async (path) => {
    const response = await handleDashboardApi(
      request(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      }),
    )

    expect(response?.status).toBe(400)
  })

  it("requires a vote id for tally requests", async () => {
    const response = await handleDashboardApi(request("/api/vote/tally"))

    expect(response?.status).toBe(400)
  })

  it("exposes browser speech synthesis", async () => {
    const response = await handleDashboardApi(
      request("/api/tts/read", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: "Release ready" }),
      }),
    )

    expect(response?.status).toBe(200)
    expect(body(response)).toEqual(
      expect.objectContaining({
        mode: "browser-speech-synthesis",
        text: "Release ready",
      }),
    )
  })

  it("ignores unknown routes", async () => {
    await expect(handleDashboardApi(request("/api/unknown"))).resolves.toBeNull()
  })
})
