import { describe, expect, it } from "vitest"
import { validateLineEdits, withLineNumbers } from "../src/review-gate/line-edits.js"

describe("review gate line edits", () => {
  describe("withLineNumbers", () => {
    it("adds line numbers to content", () => {
      const result = withLineNumbers("line1\nline2")
      expect(result).toBe("   1 | line1\n   2 | line2")
    })

    it("handles empty string", () => {
      expect(withLineNumbers("")).toBe("   1 | ")
    })

    it("handles windows line endings", () => {
      const result = withLineNumbers("a\r\nb")
      expect(result).toBe("   1 | a\n   2 | b")
    })
  })

  describe("validateLineEdits", () => {
    it("passes through valid edits", () => {
      const edits = validateLineEdits([
        { target: "file.ts", start: 1, end: 3, comment: "refactor" },
      ])

      expect(edits).toHaveLength(1)
      expect(edits[0].target).toBe("file.ts")
      expect(edits[0].start).toBe(1)
      expect(edits[0].end).toBe(3)
    })

    it("throws when target is empty", () => {
      expect(() => validateLineEdits([{ target: "   ", comment: "x" }])).toThrow(
        "Line edit target is required.",
      )
    })

    it("throws when comment is empty", () => {
      expect(() => validateLineEdits([{ target: "f", comment: "  " }])).toThrow(
        "Line edit comment is required.",
      )
    })

    it("throws when start line is not a positive integer", () => {
      expect(() =>
        validateLineEdits([{ target: "f", start: 0, comment: "x" }]),
      ).toThrow("Invalid start line")
      expect(() =>
        validateLineEdits([{ target: "f", start: 1.5, comment: "x" }]),
      ).toThrow("Invalid start line")
    })

    it("throws when end line is before start line", () => {
      expect(() =>
        validateLineEdits([{ target: "f", start: 3, end: 1, comment: "x" }]),
      ).toThrow("Invalid end line")
    })

    it("defaults end to start when omitted", () => {
      const edits = validateLineEdits([{ target: "f", start: 5, comment: "x" }])
      expect(edits[0].end).toBe(5)
    })
  })
})
