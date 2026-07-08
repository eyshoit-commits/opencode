import * as fs from "node:fs";
import * as path from "node:path";
import { runtimeRoot } from "../core/store.js";
const MAX_EVENTS = 500;
let sequence = 0;
const events = [];
const agents = new Map();
function outputFile() {
    return process.env.BKG_OC_LIVE_OUTPUT_FILE ??
        path.join(runtimeRoot(), "live-output", "events.jsonl");
}
function persistenceEnabled() {
    return process.env.BKG_OC_LIVE_OUTPUT_PERSIST !== "0";
}
export function appendLiveOutput(event) {
    if (persistenceEnabled() && sequence === 0) {
        sequence = readPersistedEvents().at(-1)?.sequence ?? 0;
    }
    const recorded = {
        ...event,
        sequence: ++sequence,
        timestamp: new Date().toISOString(),
    };
    events.push(recorded);
    if (events.length > MAX_EVENTS)
        events.splice(0, events.length - MAX_EVENTS);
    const previous = agents.get(recorded.sessionId);
    agents.set(recorded.sessionId, {
        sessionId: recorded.sessionId,
        parentId: recorded.parentId ?? previous?.parentId,
        agentName: recorded.agentName,
        instance: recorded.instance,
        depth: recorded.depth,
        status: recorded.kind === "finished" ? "finished" : "running",
        lastActivityAt: recorded.timestamp,
        lastTool: recorded.tool ?? previous?.lastTool,
    });
    if (persistenceEnabled())
        persist(recorded);
    return recorded;
}
export function getLiveOutputSnapshot(after = 0) {
    if (persistenceEnabled()) {
        const persisted = readPersistedEvents();
        const persistedAgents = buildAgentState(persisted);
        return {
            sequence: persisted.at(-1)?.sequence ?? 0,
            agents: persistedAgents,
            events: persisted.filter((event) => event.sequence > after),
        };
    }
    return {
        sequence,
        agents: [...agents.values()].sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt)),
        events: events.filter((event) => event.sequence > after),
    };
}
export function resetLiveOutput() {
    sequence = 0;
    events.length = 0;
    agents.clear();
}
function persist(event) {
    const file = outputFile();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.appendFileSync(file, JSON.stringify(event) + "\n", "utf8");
    try {
        if (fs.statSync(file).size > 2 * 1024 * 1024) {
            const compacted = readPersistedEvents();
            fs.writeFileSync(file, compacted.map((item) => JSON.stringify(item)).join("\n") + "\n", "utf8");
        }
    }
    catch {
        // A live feed must never break the agent workflow.
    }
}
function readPersistedEvents() {
    try {
        const lines = fs.readFileSync(outputFile(), "utf8").trim().split(/\r?\n/);
        return lines.slice(-MAX_EVENTS).flatMap((line) => {
            try {
                return [JSON.parse(line)];
            }
            catch {
                return [];
            }
        });
    }
    catch {
        return [];
    }
}
function buildAgentState(source) {
    const states = new Map();
    for (const event of source) {
        const previous = states.get(event.sessionId);
        states.set(event.sessionId, {
            sessionId: event.sessionId,
            parentId: event.parentId ?? previous?.parentId,
            agentName: event.agentName,
            instance: event.instance,
            depth: event.depth,
            status: event.kind === "finished" ? "finished" : previous?.status ?? "running",
            lastActivityAt: event.timestamp,
            lastTool: event.tool ?? previous?.lastTool,
        });
    }
    return [...states.values()].sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
}
