import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { castVote, determineOutcome, listVotes, tallyVotes } from "../src/ensemble/votes.js"

const VOTES_DIR = path.join(os.homedir(), ".local", "share", "opencode", "votes")

describe("votes", () => {
  beforeEach(async () => {
    await fs.rm(VOTES_DIR, { recursive: true, force: true })
  })

  afterEach(async () => {
    await fs.rm(VOTES_DIR, { recursive: true, force: true })
  })

  it("casts a vote and returns a record", async () => {
    const vote = await castVote({
      sessionId: "session-1",
      ratSessionId: "rat-1",
      agentId: "architect",
      choice: "approve",
      rationale: "Build passes.",
    })

    expect(vote.id).toBeTruthy()
    expect(vote.sessionId).toBe("session-1")
    expect(vote.ratSessionId).toBe("rat-1")
    expect(vote.agentId).toBe("architect")
    expect(vote.choice).toBe("approve")
    expect(vote.rationale).toBe("Build passes.")
    expect(vote.castAt).toBeTruthy()
  })

  it("tallies votes for a rat session", async () => {
    await castVote({ sessionId: "s1", ratSessionId: "rat-1", agentId: "a1", choice: "approve" })
    await castVote({ sessionId: "s1", ratSessionId: "rat-1", agentId: "a2", choice: "reject" })
    await castVote({ sessionId: "s1", ratSessionId: "rat-1", agentId: "a3", choice: "abstain" })

    const tally = await tallyVotes("rat-1")
    expect(tally).toEqual({
      approve: 1,
      reject: 1,
      abstain: 1,
      total: 3,
      outcome: "revise",
    })
  })

  it("returns pending when no votes exist", async () => {
    const tally = await tallyVotes("rat-empty")
    expect(tally).toEqual({
      approve: 0,
      reject: 0,
      abstain: 0,
      total: 0,
      outcome: "pending",
    })
  })

  it("determines approved when approve ratio > 0.5", async () => {
    expect(determineOutcome(3, 1, 4)).toBe("approved")
  })

  it("determines rejected when reject >= half of non-abstain and reject > approve", async () => {
    expect(determineOutcome(1, 3, 4)).toBe("rejected")
  })

  it("determines revise when both approve and reject exist", async () => {
    expect(determineOutcome(2, 2, 4)).toBe("revise")
  })

  it("determines rejected when only reject exists", async () => {
    expect(determineOutcome(0, 2, 2)).toBe("rejected")
  })

  it("lists votes filtered by rat session", async () => {
    await castVote({ sessionId: "s1", ratSessionId: "rat-1", agentId: "a1", choice: "approve" })
    await castVote({ sessionId: "s2", ratSessionId: "rat-2", agentId: "a2", choice: "reject" })

    const rat1Votes = await listVotes("rat-1")
    expect(rat1Votes).toHaveLength(1)
    expect(rat1Votes[0].ratSessionId).toBe("rat-1")

    const allVotes = await listVotes()
    expect(allVotes).toHaveLength(2)
  })

  it("skips damaged vote files when listing", async () => {
    await castVote({ sessionId: "s1", ratSessionId: "rat-1", agentId: "a1", choice: "approve" })
    await fs.writeFile(path.join(VOTES_DIR, "bad.json"), "not json")

    const votes = await listVotes()
    expect(votes).toHaveLength(1)
  })
})
