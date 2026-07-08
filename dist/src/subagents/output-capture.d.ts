export interface AgentRunOutput {
    id: string;
    agentId: string;
    delegationId?: string;
    subtaskId?: string;
    content: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}
export declare function captureOutput(input: {
    agentId: string;
    delegationId?: string;
    subtaskId?: string;
    content: string;
    metadata?: Record<string, unknown>;
}): Promise<AgentRunOutput>;
export declare function readOutput(id: string): Promise<AgentRunOutput | null>;
export declare function listOutputs(agentId?: string, delegationId?: string): Promise<AgentRunOutput[]>;
