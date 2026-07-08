import { appendLiveOutput } from "./store.js";
export function createLiveOutputReporter() {
    const rootSessionIds = new Set();
    const sessions = new Map();
    const subagents = new Map();
    const instanceCounters = new Map();
    const emittedParts = new Set();
    const toolStatuses = new Map();
    const lastToolSignature = new Map();
    const finishedSessions = new Set();
    function isDescendant(sessionId) {
        if (rootSessionIds.has(sessionId))
            return true;
        let cursor = sessionId;
        const seen = new Set();
        while (cursor && !seen.has(cursor)) {
            seen.add(cursor);
            const parentId = sessions.get(cursor)?.parentId;
            if (!parentId)
                return false;
            if (rootSessionIds.has(parentId))
                return true;
            cursor = parentId;
        }
        return false;
    }
    function depthOf(sessionId) {
        let depth = 0;
        let cursor = sessionId;
        const seen = new Set();
        while (cursor && !seen.has(cursor)) {
            seen.add(cursor);
            const parentId = sessions.get(cursor)?.parentId;
            if (!parentId || rootSessionIds.has(parentId))
                return depth + 1;
            depth += 1;
            cursor = parentId;
        }
        return depth + 1;
    }
    function assign(sessionId) {
        if (rootSessionIds.has(sessionId))
            return undefined;
        const session = sessions.get(sessionId);
        if (!session?.parentId || !isDescendant(sessionId))
            return undefined;
        const agentName = titleCase(session.agent ?? "Subagent");
        const existing = subagents.get(sessionId);
        if (existing?.agentName === agentName)
            return existing;
        const key = `${session.parentId}:${agentName}`;
        const instance = (instanceCounters.get(key) ?? 0) + 1;
        instanceCounters.set(key, instance);
        const info = { depth: depthOf(sessionId), instance, agentName };
        subagents.set(sessionId, info);
        appendLiveOutput({
            sessionId,
            parentId: session.parentId,
            ...info,
            kind: "started",
            status: "running",
        });
        return info;
    }
    return {
        handle(rawEvent) {
            if (!isRecord(rawEvent))
                return;
            const type = stringValue(rawEvent.type);
            const properties = isRecord(rawEvent.properties) ? rawEvent.properties : {};
            if (type === "session.created") {
                const info = isRecord(properties.info) ? properties.info : {};
                const id = stringValue(info.id);
                if (!id)
                    return;
                const parentId = stringValue(info.parentID);
                sessions.set(id, { parentId });
                if (!parentId)
                    rootSessionIds.add(id);
                return;
            }
            if (type === "message.updated") {
                const info = isRecord(properties.info) ? properties.info : {};
                const sessionId = stringValue(info.sessionID);
                if (!sessionId || info.role !== "assistant")
                    return;
                const session = sessions.get(sessionId) ?? {};
                session.agent ??= stringValue(info.agent);
                sessions.set(sessionId, session);
                assign(sessionId);
                return;
            }
            if (type === "session.status") {
                const sessionId = stringValue(properties.sessionID);
                const status = isRecord(properties.status) ? stringValue(properties.status.type) : undefined;
                const agent = sessionId ? subagents.get(sessionId) : undefined;
                if (sessionId && agent && status === "idle" && !finishedSessions.has(sessionId)) {
                    finishedSessions.add(sessionId);
                    appendLiveOutput({
                        sessionId,
                        parentId: sessions.get(sessionId)?.parentId,
                        ...agent,
                        kind: "finished",
                        status: "finished",
                    });
                }
                return;
            }
            if (type !== "message.part.updated")
                return;
            const part = isRecord(properties.part) ? properties.part : {};
            const sessionId = stringValue(part.sessionID);
            if (!sessionId || !isDescendant(sessionId))
                return;
            const agent = subagents.get(sessionId) ?? assign(sessionId);
            if (!agent)
                return;
            if (part.type === "tool") {
                const state = isRecord(part.state) ? part.state : {};
                const status = stringValue(state.status);
                if (status !== "running" && status !== "completed")
                    return;
                const partId = String(part.id ?? "");
                if (toolStatuses.get(partId) === status)
                    return;
                toolStatuses.set(partId, status);
                const tool = stringValue(part.tool) ?? "tool";
                const detail = summarizeToolInput(tool, state.input);
                const signature = `${tool}|${detail ?? ""}`;
                if (lastToolSignature.get(sessionId) === signature)
                    return;
                lastToolSignature.set(sessionId, signature);
                appendLiveOutput({
                    sessionId,
                    parentId: sessions.get(sessionId)?.parentId,
                    ...agent,
                    kind: "tool",
                    tool,
                    detail,
                    status,
                });
                return;
            }
            if ((part.type === "text" || part.type === "reasoning") && isRecord(part.time) && part.time.end) {
                const text = stringValue(part.text)?.trim();
                if (!text)
                    return;
                const key = `${part.type}:${String(part.id)}:${String(part.time.end)}`;
                if (emittedParts.has(key))
                    return;
                emittedParts.add(key);
                lastToolSignature.delete(sessionId);
                appendLiveOutput({
                    sessionId,
                    parentId: sessions.get(sessionId)?.parentId,
                    ...agent,
                    kind: part.type,
                    text,
                });
            }
        },
    };
}
function summarizeToolInput(tool, rawInput) {
    const input = isRecord(rawInput) ? rawInput : {};
    const preferred = {
        read: ["filePath", "path"],
        bash: ["description", "command"],
        skill: ["name"],
        glob: ["pattern", "path"],
        grep: ["pattern", "include", "path"],
        task: ["description", "subagent_type", "prompt"],
        write: ["filePath", "path"],
        edit: ["filePath", "path"],
    };
    return getField(input, preferred[tool] ?? [
        "description", "name", "filePath", "path", "pattern", "query", "url", "prompt", "command",
    ]);
}
function getField(input, keys) {
    for (const key of keys) {
        const value = stringValue(input[key])?.trim();
        if (value)
            return value;
    }
    return undefined;
}
function titleCase(value) {
    return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
        .replace(/\b\w/g, (character) => character.toUpperCase());
}
function isRecord(value) {
    return Boolean(value && typeof value === "object");
}
function stringValue(value) {
    return typeof value === "string" ? value : undefined;
}
