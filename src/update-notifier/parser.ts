import type { PinnedPluginRef } from "./types.js"

const SEMVER = "v?\\d+\\.\\d+\\.\\d+(?:[-+][A-Za-z0-9.-]+)?"

export function parsePinnedPlugin(raw: string): PinnedPluginRef | null {
  if (raw.startsWith(".") || raw.startsWith("/") || raw.startsWith("file:")) return null

  const githubMatch = raw.match(new RegExp(`^([^@]+)@git\\+https://github\\.com/([^/#]+/[^/#.]+)(?:\\.git)?#(${SEMVER})$`))
  if (githubMatch) {
    return {
      raw,
      name: githubMatch[1],
      source: githubMatch[2],
      currentVersion: githubMatch[3].replace(/^v/, ""),
      kind: "github-git",
    }
  }

  const scoped = raw.match(new RegExp(`^(@[^/]+/[^@]+)@(${SEMVER})$`))
  if (scoped) {
    return { raw, name: scoped[1], currentVersion: scoped[2].replace(/^v/, ""), kind: "npm" }
  }

  const unscoped = raw.match(new RegExp(`^([^@/]+)@(${SEMVER})$`))
  if (unscoped) {
    return { raw, name: unscoped[1], currentVersion: unscoped[2].replace(/^v/, ""), kind: "npm" }
  }

  return null
}

export function extractPinnedPluginsFromConfig(config: unknown): PinnedPluginRef[] {
  if (!config || typeof config !== "object") return []
  const plugin = (config as { plugin?: unknown; plugins?: unknown }).plugin ?? (config as { plugins?: unknown }).plugins
  if (!Array.isArray(plugin)) return []
  return plugin.filter((item): item is string => typeof item === "string").map(parsePinnedPlugin).filter((item): item is PinnedPluginRef => Boolean(item))
}
