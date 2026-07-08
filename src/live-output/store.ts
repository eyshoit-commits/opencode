import type { LiveAgentState, LiveOutputEvent, LiveOutputSnapshot } from "./types.js"

const MAX_EVENTS = 500
let sequence = 0
const events: LiveOutputEvent[] = []
const agents = new Map<string, LiveAgentState>()

export function appendLiveOutput(
  event: Omit<LiveOutputEvent, "sequence" | "timestamp">,
): LiveOutputEvent {
  const recorded: LiveOutputEvent = {
    ...event,
    sequence: ++sequence,
    timestamp: new Date().toISOString(),
  }
  events.push(recorded)
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS)

  const previous = agents.get(recorded.sessionId)
  agents.set(recorded.sessionId, {
    sessionId: recorded.sessionId,
    parentId: recorded.parentId ?? previous?.parentId,
    agentName: recorded.agentName,
    instance: recorded.instance,
    depth: recorded.depth,
    status: recorded.kind === "finished" ? "finished" : "running",
    lastActivityAt: recorded.timestamp,
    lastTool: recorded.tool ?? previous?.lastTool,
  })
  return recorded
}

export function getLiveOutputSnapshot(after = 0): LiveOutputSnapshot {
  return {
    sequence,
    agents: [...agents.values()].sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt)),
    events: events.filter((event) => event.sequence > after),
  }
}

export function resetLiveOutput(): void {
  sequence = 0
  events.length = 0
  agents.clear()
}
