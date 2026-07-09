import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

export type VoteChoice = "approve" | "reject" | "abstain";
export type VoteOutcome = "approved" | "rejected" | "revise" | "blocked";

export interface VoteRecord {
  id: string;
  sessionId: string;
  ratSessionId: string;
  agentId: string;
  choice: VoteChoice;
  rationale?: string;
  castAt: string;
}

export interface VoteTally {
  approve: number;
  reject: number;
  abstain: number;
  total: number;
  outcome: VoteOutcome | "pending";
}

export interface UserApproval {
  id: string;
  ratSessionId: string;
  decision: VoteOutcome;
  context: Record<string, unknown>;
  decidedAt: string;
  decidedBy: string;
}

const VOTES_DIR = path.join(
  os.homedir(),
  ".local",
  "share",
  "opencode",
  "votes",
);
const APPROVALS_DIR = path.join(
  os.homedir(),
  ".local",
  "share",
  "opencode",
  "user-approvals",
);

function makeId(): string {
  return `vote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

async function ensureVotesDir(): Promise<void> {
  await fs.mkdir(VOTES_DIR, { recursive: true });
}

async function ensureApprovalsDir(): Promise<void> {
  await fs.mkdir(APPROVALS_DIR, { recursive: true });
}

function votePath(id: string): string {
  return path.join(VOTES_DIR, `${id}.json`);
}

function approvalPath(id: string): string {
  return path.join(APPROVALS_DIR, `${id}.json`);
}

export async function castVote(input: {
  sessionId: string;
  ratSessionId: string;
  agentId: string;
  choice: VoteChoice;
  rationale?: string;
}): Promise<VoteRecord> {
  await ensureVotesDir();
  const vote: VoteRecord = {
    id: makeId(),
    sessionId: input.sessionId,
    ratSessionId: input.ratSessionId,
    agentId: input.agentId,
    choice: input.choice,
    rationale: input.rationale,
    castAt: now(),
  };
  await fs.writeFile(
    votePath(vote.id),
    JSON.stringify(vote, null, 2) + "\n",
    "utf8",
  );
  return vote;
}

export async function tallyVotes(ratSessionId: string): Promise<VoteTally> {
  await ensureVotesDir();
  const files = await fs.readdir(VOTES_DIR);
  let approve = 0;
  let reject = 0;
  let abstain = 0;
  for (const file of files.filter((f: string) => f.endsWith(".json"))) {
    try {
      const v = JSON.parse(
        await fs.readFile(path.join(VOTES_DIR, file), "utf8"),
      ) as VoteRecord;
      if (v.ratSessionId !== ratSessionId) continue;
      if (v.choice === "approve") approve++;
      else if (v.choice === "reject") reject++;
      else if (v.choice === "abstain") abstain++;
    } catch {
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

export function determineOutcome(
  approve: number,
  reject: number,
  total: number,
): VoteOutcome | "pending" {
  if (total === 0) return "pending";
  const nonAbstain = approve + reject;
  if (nonAbstain === 0) return "pending";
  const approveRatio = approve / nonAbstain;
  if (approveRatio > 0.5) return "approved";
  if (reject > approve && reject >= Math.ceil(nonAbstain / 2))
    return "rejected";
  if (reject > 0 && approve > 0) return "revise";
  return "blocked";
}

export async function listVotes(ratSessionId?: string): Promise<VoteRecord[]> {
  await ensureVotesDir();
  const files = await fs.readdir(VOTES_DIR);
  const votes: VoteRecord[] = [];
  for (const file of files.filter((f: string) => f.endsWith(".json"))) {
    try {
      const v = JSON.parse(
        await fs.readFile(path.join(VOTES_DIR, file), "utf8"),
      ) as VoteRecord;
      if (!ratSessionId || v.ratSessionId === ratSessionId) votes.push(v);
    } catch {
      // skip damaged records
    }
  }
  return votes.sort((a, b) => b.castAt.localeCompare(a.castAt));
}

export async function recordUserApproval(input: {
  ratSessionId: string;
  decision: VoteOutcome;
  context?: Record<string, unknown>;
  decidedBy?: string;
}): Promise<UserApproval> {
  await ensureApprovalsDir();
  const approval: UserApproval = {
    id: makeId(),
    ratSessionId: input.ratSessionId,
    decision: input.decision,
    context: input.context ?? {},
    decidedAt: now(),
    decidedBy: input.decidedBy ?? "user",
  };
  await fs.writeFile(
    approvalPath(approval.id),
    JSON.stringify(approval, null, 2) + "\n",
    "utf8",
  );
  return approval;
}

export async function readUserApproval(id: string): Promise<UserApproval> {
  const raw = await fs.readFile(approvalPath(id), "utf8");
  return JSON.parse(raw) as UserApproval;
}

export async function listUserApprovals(
  ratSessionId?: string,
): Promise<UserApproval[]> {
  await ensureApprovalsDir();
  const files = await fs.readdir(APPROVALS_DIR);
  const approvals: UserApproval[] = [];
  for (const file of files.filter((f: string) => f.endsWith(".json"))) {
    try {
      const a = JSON.parse(
        await fs.readFile(path.join(APPROVALS_DIR, file), "utf8"),
      ) as UserApproval;
      if (!ratSessionId || a.ratSessionId === ratSessionId) approvals.push(a);
    } catch {
      // skip damaged records
    }
  }
  return approvals.sort((a, b) => b.decidedAt.localeCompare(a.decidedAt));
}
