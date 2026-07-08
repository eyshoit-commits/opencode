import type { AcpCompatibilityConfig } from "./types.js";
export declare function loadAcpCompatibilityConfig(env?: NodeJS.ProcessEnv): AcpCompatibilityConfig;
export declare function reviewGateTimeoutMs(config?: AcpCompatibilityConfig): number;
