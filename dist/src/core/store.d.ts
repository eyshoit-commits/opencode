import type { PluginRuntimeState } from "./types";
export declare function runtimeRoot(): string;
export declare function statePath(): string;
export declare function defaultState(): PluginRuntimeState;
export declare function ensureRuntimeRoot(): Promise<void>;
export declare function readState(): Promise<PluginRuntimeState>;
export declare function writeState(state: PluginRuntimeState): Promise<void>;
export declare function updateState<T>(fn: (state: PluginRuntimeState) => T | Promise<T>): Promise<T>;
