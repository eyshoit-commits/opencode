export interface SubDelegation {
    id: string;
    parentId?: string;
    prompt: string;
    agent: string;
    status: "pending" | "running" | "complete" | "error" | "timeout";
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    result?: string;
    error?: string;
    subtaskIds: string[];
}
export declare function createDelegation(input: {
    prompt: string;
    agent: string;
    parentId?: string;
}): Promise<SubDelegation>;
export declare function updateDelegation(id: string, update: Partial<SubDelegation>): Promise<SubDelegation>;
export declare function readDelegation(id: string): Promise<SubDelegation>;
export declare function listDelegations(parentId?: string): Promise<SubDelegation[]>;
