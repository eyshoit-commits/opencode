import { type LiveOutputSnapshot } from "../live-output/index.js";
export interface DashboardState {
    generatedAt: string;
    blockers: unknown[];
    ratSessions: unknown[];
    votes: unknown[];
    memories: unknown[];
    sync: unknown;
    liveOutput: LiveOutputSnapshot;
}
export declare function getDashboardState(): Promise<DashboardState>;
export declare function summarizeDashboardState(state: DashboardState): string;
