import { describe, expect, it } from "vitest"
import { loadAcpCompatibilityConfig, reviewGateTimeoutMs } from "../src/acp/index.js"

describe("ACP compatibility config", () => {
  it("provides local-first defaults and known unsupported commands", () => {
    const config = loadAcpCompatibilityConfig({})
    expect(config).toMatchObject({
      enabled: true,
      dashboardPort: 4774,
      remoteMode: false,
      reviewGateMode: "browser",
      reviewGateTimeoutSeconds: 345600,
      unsupportedSlashCommands: ["/undo", "/redo"],
    })
    expect(reviewGateTimeoutMs(config)).toBe(345_600_000)
  })

  it("parses editor-provided environment settings", () => {
    expect(loadAcpCompatibilityConfig({
      BKG_OC_ACP_ENABLED: "0",
      BKG_OC_DASHBOARD_PORT: "6000",
      BKG_OC_DASHBOARD_REMOTE: "yes",
      BKG_OC_DASHBOARD_BROWSER: " browser ",
      BKG_OC_REVIEW_GATE_MODE: "disabled",
      BKG_OC_REVIEW_GATE_TIMEOUT_SECONDS: "120",
    })).toMatchObject({
      enabled: false,
      dashboardPort: 6000,
      remoteMode: true,
      browser: "browser",
      reviewGateMode: "disabled",
      reviewGateTimeoutSeconds: 120,
    })
  })

  it("rejects invalid ports, modes, booleans, and timeouts", () => {
    expect(() => loadAcpCompatibilityConfig({ BKG_OC_DASHBOARD_PORT: "0" })).toThrow()
    expect(() => loadAcpCompatibilityConfig({ BKG_OC_REVIEW_GATE_MODE: "tui" })).toThrow()
    expect(() => loadAcpCompatibilityConfig({ BKG_OC_ACP_ENABLED: "maybe" })).toThrow()
    expect(() => loadAcpCompatibilityConfig({
      BKG_OC_REVIEW_GATE_TIMEOUT_SECONDS: "99999999",
    })).toThrow()
  })
})
