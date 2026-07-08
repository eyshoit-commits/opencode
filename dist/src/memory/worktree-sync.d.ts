import type { MemoryRecord } from "./types.js";
export declare function readWorktreeMemory(worktree: string): Promise<MemoryRecord[]>;
export declare function appendWorktreeMemory(worktree: string, record: Omit<MemoryRecord, "id" | "createdAt" | "updatedAt">): Promise<MemoryRecord>;
export declare function syncWorktreeMemory(worktree: string, targetDir: string): Promise<void>;
