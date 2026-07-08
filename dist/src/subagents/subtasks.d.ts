export interface Subtask {
    id: string;
    delegationId: string;
    description: string;
    status: "pending" | "running" | "complete" | "error" | "skipped";
    assignedAgent?: string;
    result?: string;
    error?: string;
    createdAt: string;
    updatedAt: string;
}
export declare function createSubtask(input: {
    delegationId: string;
    description: string;
    assignedAgent?: string;
}): Promise<Subtask>;
export declare function updateSubtask(id: string, update: Partial<Subtask>): Promise<Subtask>;
export declare function readSubtask(id: string): Promise<Subtask>;
export declare function listSubtasks(delegationId?: string): Promise<Subtask[]>;
