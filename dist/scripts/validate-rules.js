import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRules } from "../src/rules-loader.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rules = await loadRules(path.join(root, "assets", "opencode", "rules"));
console.log(`Validated ${rules.length} BKG rule(s):`);
for (const rule of rules) {
    console.log(`- ${rule.name} (${rule.metadata.match}, ${rule.metadata.keywords.length} keywords)`);
}
