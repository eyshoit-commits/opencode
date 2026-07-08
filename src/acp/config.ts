import type { AcpCompatibilityConfig, AcpReviewGateMode } from "./types.js"

const DEFAULT_DASHBOARD_PORT = 4774
const DEFAULT_REVIEW_TIMEOUT_SECONDS = 96 * 60 * 60

export function loadAcpCompatibilityConfig(
  env: NodeJS.ProcessEnv = process.env,
): AcpCompatibilityConfig {
  const reviewGateMode = parseReviewGateMode(env.BKG_OC_REVIEW_GATE_MODE)
  return {
    enabled: parseBoolean(env.BKG_OC_ACP_ENABLED, true),
    dashboardPort: parseInteger(
      env.BKG_OC_DASHBOARD_PORT,
      DEFAULT_DASHBOARD_PORT,
      "BKG_OC_DASHBOARD_PORT",
      1,
      65535,
    ),
    remoteMode: parseBoolean(env.BKG_OC_DASHBOARD_REMOTE, false),
    browser: nonEmpty(env.BKG_OC_DASHBOARD_BROWSER),
    reviewGateMode,
    reviewGateTimeoutSeconds: parseInteger(
      env.BKG_OC_REVIEW_GATE_TIMEOUT_SECONDS,
      DEFAULT_REVIEW_TIMEOUT_SECONDS,
      "BKG_OC_REVIEW_GATE_TIMEOUT_SECONDS",
      1,
      30 * 24 * 60 * 60,
    ),
    unsupportedSlashCommands: ["/undo", "/redo"],
  }
}

export function reviewGateTimeoutMs(config = loadAcpCompatibilityConfig()): number {
  return config.reviewGateTimeoutSeconds * 1000
}

function parseReviewGateMode(value: string | undefined): AcpReviewGateMode {
  if (!value) return "browser"
  if (value === "browser" || value === "disabled") return value
  throw new Error(`BKG_OC_REVIEW_GATE_MODE must be "browser" or "disabled", got "${value}".`)
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback
  if (["1", "true", "yes", "on"].includes(value.toLowerCase())) return true
  if (["0", "false", "no", "off"].includes(value.toLowerCase())) return false
  throw new Error(`Invalid boolean value "${value}".`)
}

function parseInteger(
  value: string | undefined,
  fallback: number,
  name: string,
  minimum: number,
  maximum: number,
): number {
  if (!value) return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${name} must be an integer between ${minimum} and ${maximum}.`)
  }
  return parsed
}

function nonEmpty(value: string | undefined): string | undefined {
  const normalized = value?.trim()
  return normalized || undefined
}
