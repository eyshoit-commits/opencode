export interface PinnedPluginRef {
  raw: string
  name: string
  currentVersion: string
  kind: "npm" | "github-git"
  source?: string
}

export interface PluginUpdateInfo {
  plugin: PinnedPluginRef
  latestVersion?: string
  updateAvailable: boolean
  checkedAt: string
  error?: string
}

export interface UpdateNotifierConfig {
  cacheTtlMs: number
  cachePath?: string
  configPaths: string[]
}

export interface UpdateNotifierSummary {
  checkedAt: string
  updates: PluginUpdateInfo[]
  updateCount: number
  warnings: string[]
}
