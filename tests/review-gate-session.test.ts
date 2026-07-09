import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import {
  addReviewAnnotation,
  canOpenReview,
  createReviewSession,
  decideReviewSession,
  readReviewSession,
  resolveReviewWorkflow,
  waitForReviewDecision,
} from "../src/review-gate/session.js"

describe("review gate session", () => {
  let stateDir: string

  beforeEach(async () => {
    stateDir = await fs.mkdtemp(path.join(os.tmpdir(), "bkg-review-"))
    process.env.BKG_OC_PLUGIN_STATE_DIR = stateDir
  })

  afterEach(async () => {
    delete process.env.BKG_OC_PLUGIN_STATE_DIR
    await fs.rm(stateDir, { recursive: true, force: true })
  })

  it("resolves default workflow to blocker-only", () => {
    expect(resolveReviewWorkflow()).toBe("blocker-only")
    expect(resolveReviewWorkflow(undefined)).toBe("blocker-only")
  })

  it("resolves explicit workflow values", () => {
    expect(resolveReviewWorkflow("rat-only")).toBe("rat-only")
    expect(resolveReviewWorkflow("all-agents")).toBe("all-agents")
  })

  it("throws on unsupported workflow", () => {
    expect(() => resolveReviewWorkflow("tui")).toThrow("Unsupported review workflow")
  })

  it("allows blocker and rat triggers in blocker-only mode", () => {
    expect(canOpenReview({ title: "t", content: "c", trigger: "blocker", workflow: "blocker-only" })).toBe(true)
    expect(canOpenReview({ title: "t", content: "c", trigger: "rat", workflow: "blocker-only" })).toBe(true)
    expect(canOpenReview({ title: "t", content: "c", trigger: "manual", workflow: "blocker-only" })).toBe(false)
  })

  it("allows all triggers in all-agents mode", () => {
    expect(canOpenReview({ title: "t", content: "c", trigger: "agent", workflow: "all-agents" })).toBe(true)
  })

  it("allows manual trigger only in manual mode", () => {
    expect(canOpenReview({ title: "t", content: "c", trigger: "manual", workflow: "manual" })).toBe(true)
    expect(canOpenReview({ title: "t", content: "c", trigger: "blocker", workflow: "manual" })).toBe(false)
  })

  it("allows rat trigger with matching roles in rat-only mode", () => {
    expect(canOpenReview({ title: "t", content: "c", trigger: "rat", actorRole: "orchestrator", workflow: "rat-only" })).toBe(true)
    expect(canOpenReview({ title: "t", content: "c", trigger: "rat", actorRole: "builder", workflow: "rat-only" })).toBe(false)
  })

  it("creates a review session with default workflow", async () => {
    const session = await createReviewSession({
      title: "Review PR",
      content: "diff",
      trigger: "blocker",
    })

    expect(session.id).toBeTruthy()
    expect(session.workflow).toBe("blocker-only")
    expect(session.status).toBe("pending")
    expect(session.annotations).toEqual([])
    expect(session.createdAt).toBeTruthy()
  })

  it("throws when trigger is not allowed for workflow", async () => {
    await expect(
      createReviewSession({ title: "t", content: "c", trigger: "manual", workflow: "blocker-only" }),
    ).rejects.toThrow("not allowed")
  })

  it("reads a review session from disk", async () => {
    const session = await createReviewSession({
      title: "Read me",
      content: "content",
      trigger: "blocker",
    })

    const read = await readReviewSession(session.id)
    expect(read.id).toBe(session.id)
    expect(read.title).toBe("Read me")
  })

  it("adds annotations to a pending session", async () => {
    const session = await createReviewSession({
      title: "t",
      content: "c",
      trigger: "blocker",
    })

    const annotated = await addReviewAnnotation(session.id, {
      target: "line-1",
      comment: "Fix this.",
    })

    expect(annotated.annotations).toHaveLength(1)
    expect(annotated.annotations[0].comment).toBe("Fix this.")
    expect(annotated.annotations[0].id).toBeTruthy()
  })

  it("throws when adding annotation to decided session", async () => {
    const session = await createReviewSession({
      title: "t",
      content: "c",
      trigger: "blocker",
    })
    await decideReviewSession(session.id, "approved")

    await expect(
      addReviewAnnotation(session.id, { comment: "late" }),
    ).rejects.toThrow("already decided")
  })

  it("decides a pending session", async () => {
    const session = await createReviewSession({
      title: "t",
      content: "c",
      trigger: "blocker",
    })

    const decided = await decideReviewSession(session.id, "approved", {
      comment: "LGTM",
    })

    expect(decided.status).toBe("approved")
    expect(decided.feedback?.decision).toBe("approved")
    expect(decided.feedback?.comment).toBe("LGTM")
    expect(decided.feedback?.edits).toEqual([])
    expect(decided.feedback?.decidedAt).toBeTruthy()
  })

  it("validates line edits on decide", async () => {
    const session = await createReviewSession({
      title: "t",
      content: "c",
      trigger: "blocker",
    })

    await expect(
      decideReviewSession(session.id, "rejected", {
        edits: [{ target: "", start: 1, comment: "bad" }],
      }),
    ).rejects.toThrow("Line edit target is required.")
  })

  it("waits for review decision and resolves when decided", async () => {
    const session = await createReviewSession({
      title: "t",
      content: "c",
      trigger: "blocker",
    })

    const promise = waitForReviewDecision(session.id, 1000)
    await decideReviewSession(session.id, "approved")
    const result = await promise

    expect(result.status).toBe("approved")
  })

  it("times out waiting for review decision", async () => {
    const session = await createReviewSession({
      title: "t",
      content: "c",
      trigger: "blocker",
    })

    await expect(waitForReviewDecision(session.id, 100)).rejects.toThrow("timed out")
  })

  it("returns immediately if session already decided", async () => {
    const session = await createReviewSession({
      title: "t",
      content: "c",
      trigger: "blocker",
    })
    await decideReviewSession(session.id, "rejected")

    const result = await waitForReviewDecision(session.id, 1000)
    expect(result.status).toBe("rejected")
  })
})
