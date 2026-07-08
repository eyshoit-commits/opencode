import type { BitshitControlAdapter } from "./types.js";
/**
 * Compatibility-only adapter.
 *
 * Use createRuntimeBitshitAdapter() from ./runtime-adapter.js for real persisted
 * blocker, Rat, vote and memory behavior. This adapter intentionally avoids
 * random decisions and marks approval output as a stub so callers cannot mistake
 * it for production state.
 */
export declare function createBitshitAdapter(): BitshitControlAdapter;
