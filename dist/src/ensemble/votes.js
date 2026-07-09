import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
const VOTES_DIR = path.join(os.homedir(), ".local", "share", "opencode", "votes");
const APPROVALS_DIR = path.join(os.homedir(), ".local", "share", "opencode", "user-approvals");
function makeId() {
    return `vote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function now() {
    return new Date().toISOString();
}
async function ensureVotesDir() {
    await fs.mkdir(VOTES_DIR, { recursive: true });
}
async function ensureApprovalsDir() {
    await fs.mkdir(APPROVALS_DIR, { recursive: true });
}
function votePath(id) {
    return path.join(VOTES_DIR, `${id}.json`);
}
function approvalPath(id) {
    return path.join(APPROVALS_DIR, `${id}.json`);
}
export async function castVote(input) {
    await ensureVotesDir();
    const vote = {
        id: makeId(),
        sessionId: input.sessionId,
        ratSessionId: input.ratSessionId,
        agentId: input.agentId,
        choice: input.choice,
        rationale: input.rationale,
        castAt: now(),
    };
    await fs.writeFile(votePath(vote.id), JSON.stringify(vote, null, 2) + "\n", "utf8");
    return vote;
}
export async function tallyVotes(ratSessionId) {
    await ensureVotesDir();
    const files = await fs.readdir(VOTES_DIR);
    let approve = 0;
    let reject = 0;
    let abstain = 0;
    for (const file of files.filter((f) => f.endsWith(".json"))) {
        try {
            const v = JSON.parse(await fs.readFile(path.join(VOTES_DIR, file), "utf8"));
            if (v.ratSessionId !== ratSessionId)
                continue;
            if (v.choice === "approve")
                approve++;
            else if (v.choice === "reject")
                reject++;
            else if (v.choice === "abstain")
                abstain++;
        }
        catch {
            // skip damaged records
        }
    }
    const total = approve + reject + abstain;
    return {
        approve,
        reject,
        abstain,
        total,
        outcome: determineOutcome(approve, reject, total),
    };
}
export function determineOutcome(approve, reject, total) {
    if (total === 0)
        return "pending";
    const nonAbstain = approve + reject;
    if (nonAbstain === 0)
        return "pending";
    const approveRatio = approve / nonAbstain;
    if (approveRatio > 0.5)
        return "approved";
    if (reject > approve && reject >= Math.ceil(nonAbstain / 2))
        return "rejected";
    if (reject > 0 && approve > 0)
        return "revise";
    return "blocked";
}
export async function listVotes(ratSessionId) {
    await ensureVotesDir();
    const files = await fs.readdir(VOTES_DIR);
    const votes = [];
    for (const file of files.filter((f) => f.endsWith(".json"))) {
        try {
            const v = JSON.parse(await fs.readFile(path.join(VOTES_DIR, file), "utf8"));
            if (!ratSessionId || v.ratSessionId === ratSessionId)
                votes.push(v);
        }
        catch {
            // skip damaged records
        }
    }
    return votes.sort((a, b) => b.castAt.localeCompare(a.castAt));
}
export async function recordUserApproval(input) {
    await ensureApprovalsDir();
    const approval = {
        id: makeId(),
        ratSessionId: input.ratSessionId,
        decision: input.decision,
        context: input.context ?? {},
        decidedAt: now(),
        decidedBy: input.decidedBy ?? "user",
    };
    await fs.writeFile(approvalPath(approval.id), JSON.stringify(approval, null, 2) + "\n", "utf8");
    return approval;
}
export async function readUserApproval(id) {
    const raw = await fs.readFile(approvalPath(id), "utf8");
    return JSON.parse(raw);
}
export async function listUserApprovals(ratSessionId) {
    await ensureApprovalsDir();
    const files = await fs.readdir(APPROVALS_DIR);
    const approvals = [];
    for (const file of files.filter((f) => f.endsWith(".json"))) {
        try {
            const a = JSON.parse(await fs.readFile(path.join(APPROVALS_DIR, file), "utf8"));
            if (!ratSessionId || a.ratSessionId === ratSessionId)
                approvals.push(a);
        }
        catch {
            // skip damaged records
        }
    }
    return approvals.sort((a, b) => b.decidedAt.localeCompare(a.decidedAt));
}
