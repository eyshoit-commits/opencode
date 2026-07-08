import { type Plugin } from "@opencode-ai/plugin";
export interface DelegationRecord {
    id: string;
    prompt: string;
    agent: string;
    status: "registered" | "running" | "complete" | "error" | "timeout";
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    filePath: string;
    result?: string;
    error?: string;
}
export declare function createBackgroundAgentsPlugin(): Plugin;
