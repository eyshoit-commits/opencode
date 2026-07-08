import { createBackgroundAgentsPlugin } from "./background-agents.js"
import { createBitshitAdapter } from "./bitshit/adapter.js"
import { discoverRules, validateRule, installRules, getRuleMetadata } from "./rules-loader.js"
export type { BitshitControlAdapter } from "./bitshit/types.js"
export type { RuleEntry, RuleMetadata } from "./rules-loader.js"

export default createBackgroundAgentsPlugin()
export { createBackgroundAgentsPlugin, createBitshitAdapter, discoverRules, validateRule, installRules, getRuleMetadata }
