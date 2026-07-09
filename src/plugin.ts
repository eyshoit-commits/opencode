// OpenCode initializes every function exported by a plugin module as a plugin.
// Keep this runtime entrypoint deliberately narrow; the package's public API
// remains available from index.ts.
export { createBackgroundAgentsPlugin as BkgPlugin } from "./background-agents.js"
