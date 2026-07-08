import { describe, expect, it } from "vitest"
import { addConclaveRound, createConclaveSession, shouldStopConclave, synthesizeConclaveSummary } from "../src/conclave/session.js"

describe("conclave session", () => {
  it("stops once consensus threshold is reached", () => {
    let session = createConclaveSession({ query: "Should we ship?", consensusThreshold: 0.83 })
    session = addConclaveRound(
      session,
      [
        {
          agentId: "facts",
          agentName: "Facts",
          role: "Research",
          claims: [{ text: "Build passes", confidence: 0.9 }],
          reasoning: "Evidence is strong.",
          uncertainties: [],
          answer: "Ship after README fix.",
        },
      ],
      {
        captainId: "captain",
        consensus: 0.9,
        uncertaintyImprovement: 0.2,
        openIssues: [],
        stop: true,
        reason: "consensus_reached",
      },
    )

    expect(shouldStopConclave(session)).toBe(true)
    expect(session.status).toBe("complete")
    expect(synthesizeConclaveSummary(session)).toContain("Should we ship?")
  })
})
