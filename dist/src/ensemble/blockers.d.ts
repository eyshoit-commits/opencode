export interface BlockerRecord {
    id: string;
    description: string;
    context: Record<string, unknown>;
    status: "open" | "in_vote" | "resolved" | "escalated";
    severity: "low" | "medium" | "high" | "critical";
    createdAt: string;
    resolvedAt?: string;
    ratSessionId?: string;
}
export declare function createBlocker(input: {
    description: string;
    context?: Record<string, unknown>;
    severity?: "low" | "medium" | "high" | "critical";
}): Promise<BlockerRecord>;
export declare function updateBlocker(id: string, update: Partial<BlockerRecord>): Promise<BlockerRecord>;
export declare function readBlocker(id: string): Promise<BlockerRecord>;
export declare function listBlockers(status?: BlockerRecord["status"]): Promise<BlockerRecord[]>;
export declare function shouldStartRat(blocker: BlockerRecord): boolean;
export declare function autoStartRatForBlocker(blocker: BlockerRecord, agents: string[]): Promise<BlockerRecord>;
