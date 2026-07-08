export interface AgentPosition {
    agentId: string;
    role: string;
    statement: string;
    submittedAt: string;
}
export interface RatSession {
    id: string;
    blockerId: string;
    topic: string;
    agents: string[];
    status: "pending" | "active" | "complete";
    startedAt: string;
    completedAt?: string;
    summary?: string;
    positions: AgentPosition[];
    fourthVoice?: {
        source: string;
        statement: string;
        submittedAt: string;
    };
}
export declare function createRatSession(input: {
    blockerId: string;
    topic: string;
    agents: string[];
}): Promise<RatSession>;
export declare function addAgentPosition(sessionId: string, position: Omit<AgentPosition, "submittedAt">): Promise<RatSession>;
export declare function setFourthVoice(sessionId: string, input: {
    source: string;
    statement: string;
}): Promise<RatSession>;
export declare function completeRatSession(sessionId: string, summary: string): Promise<RatSession>;
export declare function readRatSession(id: string): Promise<RatSession>;
export declare function listRatSessions(blockerId?: string): Promise<RatSession[]>;
