import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
function makeId() {
    return crypto.randomUUID();
}
function now() {
    return new Date().toISOString();
}
function storePath() {
    return path.join(os.homedir(), ".local", "share", "opencode", "memory", "short-term.json");
}
export function createShortTermMemory() {
    let cache = null;
    async function load() {
        if (cache)
            return cache;
        try {
            const raw = await fs.readFile(storePath(), "utf8");
            cache = JSON.parse(raw);
            return cache;
        }
        catch {
            cache = [];
            return cache;
        }
    }
    async function save() {
        if (!cache)
            return;
        await fs.mkdir(path.dirname(storePath()), { recursive: true });
        await fs.writeFile(storePath(), JSON.stringify(cache, null, 2) + "\n", "utf8");
    }
    const store = {
        async append(record) {
            const records = await load();
            const entry = {
                id: makeId(),
                key: record.key,
                content: record.content,
                worktree: record.worktree,
                metadata: record.metadata,
                createdAt: now(),
                updatedAt: now(),
            };
            records.push(entry);
            cache = records;
            await save();
            return entry;
        },
        async read(id) {
            const records = await load();
            return records.find((r) => r.id === id) ?? null;
        },
        async list(query) {
            let records = await load();
            if (query?.key) {
                records = records.filter((r) => r.key === query.key);
            }
            if (query?.worktree) {
                records = records.filter((r) => r.worktree === query.worktree);
            }
            if (query?.search) {
                const q = query.search.toLowerCase();
                records = records.filter((r) => r.content.toLowerCase().includes(q) || r.key.toLowerCase().includes(q));
            }
            const offset = query?.offset ?? 0;
            const limit = query?.limit ?? 50;
            return records.slice(offset, offset + limit);
        },
        async search(query, worktree) {
            return store.list({ search: query, worktree });
        },
        async remove(id) {
            const records = await load();
            cache = records.filter((r) => r.id !== id);
            await save();
        },
    };
    return store;
}
