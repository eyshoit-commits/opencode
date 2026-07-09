import type { SyncConfig, SyncOperationResult, SyncStatus } from "./types.js";
export interface SyncService {
    status(): Promise<SyncStatus>;
    push(message?: string): Promise<SyncOperationResult>;
    pull(): Promise<SyncOperationResult>;
}
export declare function createSyncService(config?: SyncConfig): SyncService;
