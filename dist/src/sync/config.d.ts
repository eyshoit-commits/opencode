import type { SyncConfig, SyncPathSpec } from "./types.js";
export declare function defaultSyncConfig(): SyncConfig;
export declare function defaultSyncPaths(config?: SyncConfig, env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform): SyncPathSpec[];
