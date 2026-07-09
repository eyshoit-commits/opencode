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
export declare function castVote(input: {
    sessionId: string;
    ratSessionId: string;
    agentId: string;
    choice: VoteChoice;
    rationale?: string;
}): Promise<VoteRecord>;
export declare function tallyVotes(ratSessionId: string): Promise<VoteTally>;
export declare function determineOutcome(approve: number, reject: number, total: number): VoteOutcome | "pending";
export declare function listVotes(ratSessionId?: string): Promise<VoteRecord[]>;
export declare function recordUserApproval(input: {
    ratSessionId: string;
    decision: VoteOutcome;
    context?: Record<string, unknown>;
    decidedBy?: string;
}): Promise<UserApproval>;
export declare function readUserApproval(id: string): Promise<UserApproval>;
export declare function listUserApprovals(ratSessionId?: string): Promise<UserApproval[]>;
