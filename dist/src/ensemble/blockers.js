import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
const BLOCKERS_DIR = path.join(os.homedir(), ".local", "share", "opencode", "blockers");
function makeId() {
    return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function now() {
    return new Date().toISOString();
}
async function ensureDir() {
    await fs.mkdir(BLOCKERS_DIR, { recursive: true });
}
function recordPath(id) {
    return path.join(BLOCKERS_DIR, `${id}.json`);
}
export async function createBlocker(input) {
    await ensureDir();
    const blocker = {
        id: makeId(),
        description: input.description,
        context: input.context ?? {},
        status: "open",
        severity: input.severity ?? "medium",
        createdAt: now(),
    };
    await fs.writeFile(recordPath(blocker.id), JSON.stringify(blocker, null, 2) + "\n", "utf8");
    return blocker;
}
export async function updateBlocker(id, update) {
    const blocker = await readBlocker(id);
    Object.assign(blocker, update, { updatedAt: now() });
    await fs.writeFile(recordPath(id), JSON.stringify(blocker, null, 2) + "\n", "utf8");
    return blocker;
}
export async function readBlocker(id) {
    const raw = await fs.readFile(recordPath(id), "utf8");
    return JSON.parse(raw);
}
export async function listBlockers(status) {
    await ensureDir();
    const files = await fs.readdir(BLOCKERS_DIR);
    const blockers = [];
    for (const file of files.filter((f) => f.endsWith(".json"))) {
        try {
            const b = JSON.parse(await fs.readFile(path.join(BLOCKERS_DIR, file), "utf8"));
            if (!status || b.status === status)
                blockers.push(b);
        }
        catch {
            // skip damaged records
        }
    }
    return blockers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function shouldStartRat(blocker) {
    return blocker.status === "open" && blocker.severity !== "low";
}
