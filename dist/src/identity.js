import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { getPersonality } from "./personality.js";
function parseValue(value) {
    const v = value.trim();
    if (v === "true")
        return true;
    if (v === "false")
        return false;
    if (/^-?\d+(\.\d+)?$/.test(v))
        return Number(v);
    return v.replace(/^["']|["']$/g, "");
}
function parseFrontmatter(content) {
    const firstSep = content.indexOf("---");
    if (firstSep !== 0)
        return { _body: content.trim() };
    const secondSep = content.indexOf("---", 3);
    if (secondSep === -1)
        return { _body: content.trim() };
    const raw = content.slice(3, secondSep).trim();
    const body = content.slice(secondSep + 3).trim();
    const result = {};
    const lines = raw.split("\n");
    let currentKey = "";
    let currentIsObj = false;
    for (const line of lines) {
        const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
        if (m) {
            currentKey = m[1];
            const val = m[2].trim();
            if (val === "") {
                result[currentKey] = {};
                currentIsObj = true;
            }
            else {
                result[currentKey] = parseValue(val);
                currentIsObj = false;
            }
        }
        else if (currentIsObj) {
            const sm = line.match(/^\s{2,}(\w[\w-]*):\s*(.*)$/);
            if (sm) {
                const obj = result[currentKey];
                if (typeof obj === "object" && obj !== null) {
                    ;
                    obj[sm[1]] = parseValue(sm[2]);
                }
            }
        }
    }
    result._body = body;
    return result;
}
function deriveRole(id) {
    const parts = id.split("-");
    return parts[parts.length - 1];
}
function deriveName(id, fm, role) {
    const desc = fm.description;
    if (typeof desc === "string") {
        const dot = desc.indexOf(".");
        if (dot > 0)
            return desc.slice(0, dot).trim();
        return desc.trim();
    }
    return role.charAt(0).toUpperCase() + role.slice(1);
}
function deriveTools(fm) {
    const tools = fm.tools;
    if (!tools || typeof tools !== "object")
        return [];
    return Object.entries(tools)
        .filter(([, v]) => v === true)
        .map(([k]) => k);
}
function deriveMode(fm, role) {
    if (fm.mode === "primary")
        return "primary";
    if (fm.mode === "council")
        return "council";
    if (fm.mode === "vote")
        return "vote";
    if (fm.mode === "support" || fm.mode === "subagent")
        return "support";
    if (role === "orchestrator")
        return "primary";
    if (role === "chair" || role === "recorder" || role === "auditor")
        return "vote";
    return "support";
}
function getDir() {
    return resolve(dirname(fileURLToPath(import.meta.url)), "../assets/opencode/agents");
}
export function createIdentityRegistry() {
    let agents;
    function load() {
        if (agents)
            return agents;
        const dir = getDir();
        const files = readdirSync(dir).filter(f => f.endsWith(".md"));
        agents = files.map(file => {
            const id = basename(file, ".md");
            const content = readFileSync(resolve(dir, file), "utf-8");
            const fm = parseFrontmatter(content);
            const role = deriveRole(id);
            const preset = getPersonality(role);
            const description = typeof fm.description === "string"
                ? fm.description.trim()
                : deriveFirstParagraph(fm._body ?? "");
            return {
                id,
                name: deriveName(id, fm, role),
                role,
                description,
                mode: deriveMode(fm, role),
                personality: preset.tone,
                tools: deriveTools(fm),
                temperature: typeof fm.temperature === "number" ? fm.temperature : 0.2,
            };
        });
        return agents;
    }
    return {
        get(id) {
            return load().find(a => a.id === id);
        },
        list() {
            return load();
        },
        listByRole(role) {
            return load().filter(a => a.role === role);
        },
    };
}
function deriveFirstParagraph(body) {
    const para = body.split(/\n\n+/)[0] || body;
    return para.trim();
}
