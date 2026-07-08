import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
const DELEGATIONS_DIR = path.join(os.homedir(), ".local", "share", "opencode", "delegations");
function makeId() {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: "-",
        length: 3,
        style: "lowerCase",
    });
}
async function ensureDir() {
    await fs.mkdir(DELEGATIONS_DIR, { recursive: true });
}
function recordPath(id) {
    return path.join(DELEGATIONS_DIR, `${id}.json`);
}
export async function createDelegation(input) {
    await ensureDir();
    const id = makeId();
    const now = new Date().toISOString();
    const title = input.prompt.split("\n").find((l) => l.trim().length > 0)?.trim().slice(0, 48) ?? "Delegation";
    const record = {
        id,
        parentId: input.parentId,
        prompt: input.prompt,
        agent: input.agent,
        status: "pending",
        title,
        description: input.prompt.slice(0, 180),
        createdAt: now,
        updatedAt: now,
        subtaskIds: [],
    };
    await fs.writeFile(recordPath(id), JSON.stringify(record, null, 2) + "\n", "utf8");
    return record;
}
export async function updateDelegation(id, update) {
    const record = await readDelegation(id);
    Object.assign(record, update, { updatedAt: new Date().toISOString() });
    await fs.writeFile(recordPath(id), JSON.stringify(record, null, 2) + "\n", "utf8");
    return record;
}
export async function readDelegation(id) {
    const raw = await fs.readFile(recordPath(id), "utf8");
    return JSON.parse(raw);
}
export async function listDelegations(parentId) {
    await ensureDir();
    const files = await fs.readdir(DELEGATIONS_DIR);
    const records = [];
    for (const file of files.filter((f) => f.endsWith(".json"))) {
        try {
            const r = JSON.parse(await fs.readFile(path.join(DELEGATIONS_DIR, file), "utf8"));
            if (!parentId || r.parentId === parentId) {
                records.push(r);
            }
        }
        catch {
            // skip damaged records
        }
    }
    return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
