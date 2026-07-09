import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import {
  addAgentPosition,
  completeRatSession,
  createRatSession,
  listRatSessions,
  readRatSession,
  setFourthVoice,
} from "../src/ensemble/rat.js"

const RAT_DIR = path.join(os.homedir(), ".local", "share", "opencode", "rat-sessions")

describe("rat sessions", () => {
  beforeEach(async () => {
    await fs.rm(RAT_DIR, { recursive: true, force: true })
  })

  afterEach(async () => {
    await fs.rm(RAT_DIR, { recursive: true, force: true })
  })

  it("creates a rat session with default active status", async () => {
    const session = await createRatSession({
      blockerId: "blocker-1",
      topic: "Should we ship?",
      agents: ["architect", "reviewer"],
    })

    expect(session.id).toBeTruthy()
    expect(session.blockerId).toBe("blocker-1")
    expect(session.topic).toBe("Should we ship?")
    expect(session.agents).toEqual(["architect", "reviewer"])
    expect(session.status).toBe("active")
    expect(session.positions).toEqual([])
    expect(session.startedAt).toBeTruthy()
  })

  it("adds agent positions to a session", async () => {
    const session = await createRatSession({
      blockerId: "b1",
      topic: "t1",
      agents: ["a1"],
    })

    const updated = await addAgentPosition(session.id, {
      agentId: "a1",
      role: "Reviewer",
      statement: "Looks good.",
    })

    expect(updated.positions).toHaveLength(1)
    expect(updated.positions[0].agentId).toBe("a1")
    expect(updated.positions[0].statement).toBe("Looks good.")
    expect(updated.positions[0].submittedAt).toBeTruthy()
  })

  it("sets fourth voice on a session", async () => {
    const session = await createRatSession({
      blockerId: "b1",
      topic: "t1",
      agents: ["a1"],
    })

    const updated = await setFourthVoice(session.id, {
      source: "oracle",
      statement: "Consider edge cases.",
    })

    expect(updated.fourthVoice).toEqual({
      source: "oracle",
      statement: "Consider edge cases.",
      submittedAt: expect.any(String),
    })
  })

  it("completes a rat session", async () => {
    const session = await createRatSession({
      blockerId: "b1",
      topic: "t1",
      agents: ["a1"],
    })

    const completed = await completeRatSession(session.id, "Consensus reached.")

    expect(completed.status).toBe("complete")
    expect(completed.completedAt).toBeTruthy()
    expect(completed.summary).toBe("Consensus reached.")
  })

  it("reads a rat session by id", async () => {
    const session = await createRatSession({
      blockerId: "b1",
      topic: "t1",
      agents: ["a1"],
    })

    const read = await readRatSession(session.id)
    expect(read.id).toBe(session.id)
    expect(read.topic).toBe("t1")
  })

  it("lists rat sessions filtered by blocker id", async () => {
    await createRatSession({ blockerId: "b1", topic: "t1", agents: ["a1"] })
    await createRatSession({ blockerId: "b2", topic: "t2", agents: ["a2"] })
    await createRatSession({ blockerId: "b1", topic: "t3", agents: ["a3"] })

    const b1Sessions = await listRatSessions("b1")
    expect(b1Sessions).toHaveLength(2)
    expect(b1Sessions.every((s) => s.blockerId === "b1")).toBe(true)

    const allSessions = await listRatSessions()
    expect(allSessions).toHaveLength(3)
  })

  it("skips damaged records when listing", async () => {
    await createRatSession({
      blockerId: "b1",
      topic: "t1",
      agents: ["a1"],
    })
    await fs.writeFile(path.join(RAT_DIR, "bad.json"), "not json")

    const sessions = await listRatSessions()
    expect(sessions).toHaveLength(1)
    expect(sessions[0].id).toBe(sessions[0].id)
  })

  it("returns sessions sorted by startedAt descending", async () => {
    const s1 = await createRatSession({ blockerId: "b1", topic: "t1", agents: ["a1"] })
    await new Promise((r) => setTimeout(r, 10))
    const s2 = await createRatSession({ blockerId: "b1", topic: "t2", agents: ["a2"] })

    const sessions = await listRatSessions("b1")
    expect(sessions[0].id).toBe(s2.id)
    expect(sessions[1].id).toBe(s1.id)
  })
})
