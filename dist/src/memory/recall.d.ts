import type { ExternalRecallAdapter } from "./types.js";
export declare function registerRecallAdapter(adapter: ExternalRecallAdapter): void;
export declare function getRecallAdapter(name: string): ExternalRecallAdapter | undefined;
export declare function listRecallAdapters(): ExternalRecallAdapter[];
export declare function recallFromExternal(query: string, adapterName?: string, context?: Record<string, unknown>): Promise<string | null>;
