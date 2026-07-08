export interface AgentIdentity {
    id: string;
    name: string;
    role: string;
    description: string;
    mode: "primary" | "council" | "vote" | "support";
    personality: string;
    tools: string[];
    temperature: number;
}
export interface IdentityRegistry {
    get(id: string): AgentIdentity | undefined;
    list(): AgentIdentity[];
    listByRole(role: string): AgentIdentity[];
}
export declare function createIdentityRegistry(): IdentityRegistry;
