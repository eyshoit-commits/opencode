import { afterEach, beforeEach, describe, expect, it } from "vitest"
import {
  createLiveOutputReporter,
  getLiveOutputSnapshot,
  resetLiveOutput,
} from "../src/live-output/index.js"

beforeEach(resetLiveOutput)

beforeEach(() => {
  process.env.BKG_OC_LIVE_OUTPUT_PERSIST = "0"
})

afterEach(() => {
  delete process.env.BKG_OC_LIVE_OUTPUT_PERSIST
})

describe("live subagent output reporter", () => {
  it("tracks nested agents, deduplicates tools and records completion", () => {
    const reporter = createLiveOutputReporter()
    reporter.handle({ type: "session.created", properties: { info: { id: "root" } } })
    reporter.handle({ type: "session.created", properties: { info: { id: "child", parentID: "root" } } })
    reporter.handle({
      type: "message.updated",
      properties: { info: { sessionID: "child", role: "assistant", agent: "explore" } },
    })
    reporter.handle({
      type: "message.part.updated",
      properties: {
        part: {
          id: "tool-1",
          sessionID: "child",
          type: "tool",
          tool: "read",
          state: { status: "running", input: { filePath: "src/index.ts" } },
        },
      },
    })
    reporter.handle({
      type: "message.part.updated",
      properties: {
        part: {
          id: "tool-1",
          sessionID: "child",
          type: "tool",
          tool: "read",
          state: { status: "completed", input: { filePath: "src/index.ts" } },
        },
      },
    })
    reporter.handle({
      type: "message.part.updated",
      properties: {
        part: {
          id: "text-1",
          sessionID: "child",
          type: "text",
          text: "Found the entrypoint.",
          time: { end: 1 },
        },
      },
    })
    reporter.handle({
      type: "session.status",
      properties: { sessionID: "child", status: { type: "idle" } },
    })

    const snapshot = getLiveOutputSnapshot()
    expect(snapshot.agents).toEqual([
      expect.objectContaining({ agentName: "Explore", instance: 1, depth: 1, status: "finished" }),
    ])
    expect(snapshot.events.map((event) => event.kind)).toEqual([
      "started", "tool", "text", "finished",
    ])
    expect(snapshot.events.find((event) => event.kind === "tool")?.detail).toBe("src/index.ts")
  })

  it("supports more than one root session in a long-lived plugin process", () => {
    const reporter = createLiveOutputReporter()
    for (const root of ["root-a", "root-b"]) {
      reporter.handle({ type: "session.created", properties: { info: { id: root } } })
      reporter.handle({
        type: "session.created",
        properties: { info: { id: `${root}-child`, parentID: root } },
      })
      reporter.handle({
        type: "message.updated",
        properties: {
          info: { sessionID: `${root}-child`, role: "assistant", agent: "builder" },
        },
      })
    }

    expect(getLiveOutputSnapshot().agents).toHaveLength(2)
  })

  it("bridges events to a separately running dashboard process", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "bkg-live-output-"))
    process.env.BKG_OC_LIVE_OUTPUT_FILE = path.join(root, "events.jsonl")
    delete process.env.BKG_OC_LIVE_OUTPUT_PERSIST
    const reporter = createLiveOutputReporter()
    reporter.handle({ type: "session.created", properties: { info: { id: "root" } } })
    reporter.handle({
      type: "session.created",
      properties: { info: { id: "child", parentID: "root" } },
    })
    reporter.handle({
      type: "message.updated",
      properties: { info: { sessionID: "child", role: "assistant", agent: "reviewer" } },
    })

    resetLiveOutput()
    expect(getLiveOutputSnapshot().agents[0]).toEqual(
      expect.objectContaining({ agentName: "Reviewer", status: "running" }),
    )
    delete process.env.BKG_OC_LIVE_OUTPUT_FILE
    await fs.rm(root, { recursive: true, force: true })
  })
})
import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
