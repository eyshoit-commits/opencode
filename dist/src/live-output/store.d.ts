import type { LiveOutputEvent, LiveOutputSnapshot } from "./types.js";
export declare function appendLiveOutput(event: Omit<LiveOutputEvent, "sequence" | "timestamp">): LiveOutputEvent;
export declare function getLiveOutputSnapshot(after?: number): LiveOutputSnapshot;
export declare function resetLiveOutput(): void;
