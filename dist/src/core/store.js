import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
export function runtimeRoot() {
    return process.env.BKG_OC_PLUGIN_STATE_DIR ?? path.join(os.homedir(), ".local", "share", "bkg-oc-plugin-stop-4uck-m3-agen1s");
}
export function statePath() {
    return path.join(runtimeRoot(), "state.json");
}
export function defaultState() {
    return {
        blockers: [],
        ratSessions: [],
        approvals: [],
        memories: [],
    };
}
export async function ensureRuntimeRoot() {
    await fs.mkdir(runtimeRoot(), { recursive: true });
}
export async function readState() {
    await ensureRuntimeRoot();
    try {
        const raw = await fs.readFile(statePath(), "utf8");
        const parsed = JSON.parse(raw);
        return {
            blockers: Array.isArray(parsed.blockers) ? parsed.blockers : [],
            ratSessions: Array.isArray(parsed.ratSessions) ? parsed.ratSessions : [],
            approvals: Array.isArray(parsed.approvals) ? parsed.approvals : [],
            memories: Array.isArray(parsed.memories) ? parsed.memories : [],
        };
    }
    catch (error) {
        const state = defaultState();
        await writeState(state);
        return state;
    }
}
export async function writeState(state) {
    await ensureRuntimeRoot();
    await fs.writeFile(statePath(), JSON.stringify(state, null, 2) + "\n", "utf8");
}
export async function updateState(fn) {
    const state = await readState();
    const result = await fn(state);
    await writeState(state);
    return result;
}
