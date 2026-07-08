import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
const RAT_DIR = path.join(os.homedir(), ".local", "share", "opencode", "rat-sessions");
function makeId() {
    return `rat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function now() {
    return new Date().toISOString();
}
async function ensureDir() {
    await fs.mkdir(RAT_DIR, { recursive: true });
}
function recordPath(id) {
    return path.join(RAT_DIR, `${id}.json`);
}
export async function createRatSession(input) {
    await ensureDir();
    const session = {
        id: makeId(),
        blockerId: input.blockerId,
        topic: input.topic,
        agents: input.agents,
        status: "active",
        startedAt: now(),
        positions: [],
    };
    await fs.writeFile(recordPath(session.id), JSON.stringify(session, null, 2) + "\n", "utf8");
    return session;
}
export async function addAgentPosition(sessionId, position) {
    const session = await readRatSession(sessionId);
    session.positions.push({ ...position, submittedAt: now() });
    await fs.writeFile(recordPath(sessionId), JSON.stringify(session, null, 2) + "\n", "utf8");
    return session;
}
export async function setFourthVoice(sessionId, input) {
    const session = await readRatSession(sessionId);
    session.fourthVoice = { ...input, submittedAt: now() };
    await fs.writeFile(recordPath(sessionId), JSON.stringify(session, null, 2) + "\n", "utf8");
    return session;
}
export async function completeRatSession(sessionId, summary) {
    const session = await readRatSession(sessionId);
    session.status = "complete";
    session.completedAt = now();
    session.summary = summary;
    await fs.writeFile(recordPath(sessionId), JSON.stringify(session, null, 2) + "\n", "utf8");
    return session;
}
export async function readRatSession(id) {
    const raw = await fs.readFile(recordPath(id), "utf8");
    return JSON.parse(raw);
}
export async function listRatSessions(blockerId) {
    await ensureDir();
    const files = await fs.readdir(RAT_DIR);
    const sessions = [];
    for (const file of files.filter((f) => f.endsWith(".json"))) {
        try {
            const s = JSON.parse(await fs.readFile(path.join(RAT_DIR, file), "utf8"));
            if (!blockerId || s.blockerId === blockerId)
                sessions.push(s);
        }
        catch {
            // skip damaged records
        }
    }
    return sessions.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}
