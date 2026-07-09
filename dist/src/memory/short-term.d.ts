import type { MemoryRecord, MemoryStore } from "./types.js";
export declare function createShortTermMemory(): MemoryStore;
export declare function exportShortTermMemory(targetPath: string): Promise<void>;
export declare function importShortTermMemory(sourcePath: string, store?: MemoryStore): Promise<MemoryRecord[]>;
