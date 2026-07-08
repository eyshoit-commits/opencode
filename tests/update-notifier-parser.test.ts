import { describe, expect, it } from "vitest"
import { extractPinnedPluginsFromConfig, parsePinnedPlugin } from "../src/update-notifier/parser.js"

describe("parsePinnedPlugin", () => {
  it("parses unscoped pinned npm plugin refs", () => {
    expect(parsePinnedPlugin("octto@1.2.3")).toMatchObject({
      name: "octto",
      currentVersion: "1.2.3",
      kind: "npm",
    })
  })

  it("parses scoped pinned npm plugin refs", () => {
    expect(parsePinnedPlugin("@plannotator/opencode@0.22.0")).toMatchObject({
      name: "@plannotator/opencode",
      currentVersion: "0.22.0",
      kind: "npm",
    })
  })

  it("ignores unpinned and local refs", () => {
    expect(parsePinnedPlugin("octto")).toBeNull()
    expect(parsePinnedPlugin("./local-plugin")).toBeNull()
  })

  it("extracts pinned refs from plugin config", () => {
    const refs = extractPinnedPluginsFromConfig({
      plugin: ["octto@1.2.3", "local-plugin", "@scope/pkg@2.0.0"],
    })
    expect(refs).toHaveLength(2)
  })
})
