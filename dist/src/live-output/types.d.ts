export type LiveOutputKind = "started" | "tool" | "text" | "reasoning" | "finished";
export interface LiveOutputEvent {
    sequence: number;
    sessionId: string;
    parentId?: string;
    agentName: string;
    instance: number;
    depth: number;
    kind: LiveOutputKind;
    timestamp: string;
    tool?: string;
    detail?: string;
    text?: string;
    status?: string;
}
export interface LiveAgentState {
    sessionId: string;
    parentId?: string;
    agentName: string;
    instance: number;
    depth: number;
    status: "running" | "finished";
    lastActivityAt: string;
    lastTool?: string;
}
export interface LiveOutputSnapshot {
    sequence: number;
    agents: LiveAgentState[];
    events: LiveOutputEvent[];
}
