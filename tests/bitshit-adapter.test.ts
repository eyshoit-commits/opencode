import { describe, expect, it } from "vitest"
import { createBitshitAdapter } from "../src/bitshit/adapter.js"

describe("bitshit compatibility adapter", () => {
  const adapter = createBitshitAdapter()

  it("reports a blocker with generated id and open status", async () => {
    const blocker = await adapter.reportBlocker({
      taskId: "task-1",
      description: "Missing decision",
      context: { file: "src/foo.ts" },
      severity: "high",
    })

    expect(blocker.id).toBeTruthy()
    expect(blocker.taskId).toBe("task-1")
    expect(blocker.description).toBe("Missing decision")
    expect(blocker.status).toBe("open")
    expect(blocker.severity).toBe("high")
    expect(blocker.createdAt).toBeTruthy()
  })

  it("starts a rat session", async () => {
    const rat = await adapter.startRat({
      blockerId: "b1",
      topic: "Topic",
      agents: ["a1", "a2"],
    })

    expect(rat.id).toBeTruthy()
    expect(rat.blockerId).toBe("b1")
    expect(rat.topic).toBe("Topic")
    expect(rat.agents).toEqual(["a1", "a2"])
    expect(rat.status).toBe("active")
    expect(rat.startedAt).toBeTruthy()
  })

  it("records a vote", async () => {
    const vote = await adapter.recordVote({
      sessionId: "s1",
      agentId: "a1",
      choice: "approve",
      rationale: "Good.",
    })

    expect(vote.id).toBeTruthy()
    expect(vote.sessionId).toBe("s1")
    expect(vote.agentId).toBe("a1")
    expect(vote.choice).toBe("approve")
    expect(vote.rationale).toBe("Good.")
    expect(vote.castAt).toBeTruthy()
  })

  it("returns stub approval decision", async () => {
    const decision = await adapter.requestApproval({
      voteSessionId: "v1",
      context: {},
    })

    expect(decision.decision).toBe("blocked")
    expect(decision.decidedBy).toBe("bitshit-adapter-stub")
    expect(decision.isStub).toBe(true)
    expect(decision.voteSummary).toEqual({ approve: 0, reject: 0, abstain: 0, total: 0 })
    expect(decision.decidedAt).toBeTruthy()
  })

  it("remember is a no-op", async () => {
    await expect(adapter.remember({ key: "k", content: "c" })).resolves.toBeUndefined()
  })
})
