import { createBackgroundAgentsPlugin } from "./background-agents.js"
import { createBitshitAdapter } from "./bitshit/adapter.js"
export type { BitshitControlAdapter } from "./bitshit/types.js"

export default createBackgroundAgentsPlugin()
export { createBackgroundAgentsPlugin, createBitshitAdapter }
