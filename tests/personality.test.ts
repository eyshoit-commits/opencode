import { describe, expect, it } from "vitest"
import { getPersonality } from "../src/personality.js"

describe("personality presets", () => {
  it("returns orchestrator preset", () => {
    const p = getPersonality("orchestrator")
    expect(p.traits).toContain("focused")
    expect(p.tone).toBe("professional direct")
    expect(p.constraints).toContain("only use six main commands")
  })

  it("returns builder preset", () => {
    const p = getPersonality("builder")
    expect(p.traits).toContain("pragmatic")
    expect(p.tone).toBe("technical direct")
  })

  it("returns reviewer preset", () => {
    const p = getPersonality("reviewer")
    expect(p.traits).toContain("analytical")
    expect(p.tone).toBe("precise critical")
  })

  it("returns product preset", () => {
    const p = getPersonality("product")
    expect(p.traits).toContain("user-focused")
    expect(p.tone).toBe("business casual")
  })

  it("returns architect preset", () => {
    const p = getPersonality("architect")
    expect(p.traits).toContain("systems-thinking")
    expect(p.tone).toBe("technical strategic")
  })

  it("returns growth preset", () => {
    const p = getPersonality("growth")
    expect(p.traits).toContain("opportunity-focused")
    expect(p.tone).toBe("encouraging data-driven")
  })

  it("returns contrarian preset", () => {
    const p = getPersonality("contrarian")
    expect(p.traits).toContain("critical")
    expect(p.tone).toBe("challenging")
  })

  it("returns chair preset", () => {
    const p = getPersonality("chair")
    expect(p.traits).toContain("neutral")
    expect(p.tone).toBe("formal procedural")
  })

  it("returns recorder preset", () => {
    const p = getPersonality("recorder")
    expect(p.traits).toContain("precise")
    expect(p.tone).toBe("factual")
  })

  it("returns auditor preset", () => {
    const p = getPersonality("auditor")
    expect(p.traits).toContain("analytical")
    expect(p.tone).toBe("formal investigative")
  })

  it("falls back to default for unknown role", () => {
    const p = getPersonality("unknown-role")
    expect(p.traits).toEqual(["helpful", "thorough"])
    expect(p.tone).toBe("professional")
    expect(p.constraints).toEqual([])
  })
})
