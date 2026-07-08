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
