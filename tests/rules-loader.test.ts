import { describe, expect, it } from "vitest";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import {
  discoverRules,
  getRuleMetadata,
  validateRule,
  installRules,
} from "../src/rules-loader.js";

describe("rules-loader", () => {
  describe("getRuleMetadata", () => {
    it("parses valid frontmatter", () => {
      const content = `---
keywords: ["a", "b"]
match: any
description: test rule
---
body`;
      const meta = getRuleMetadata(content);
      expect(meta.keywords).toEqual(["a", "b"]);
      expect(meta.match).toBe("any");
      expect(meta.description).toBe("test rule");
    });

    it("defaults match to any when missing", () => {
      const content = `---
keywords: ["x"]
---
body`;
      const meta = getRuleMetadata(content);
      expect(meta.match).toBe("any");
    });

    it("returns empty keywords and any match for missing frontmatter", () => {
      const meta = getRuleMetadata("no frontmatter here");
      expect(meta.keywords).toEqual([]);
      expect(meta.match).toBe("any");
      expect(meta.description).toBeUndefined();
    });

    it("handles malformed keywords JSON gracefully", () => {
      const content = `---
keywords: not-json
match: all
---
body`;
      const meta = getRuleMetadata(content);
      expect(meta.keywords).toEqual([]);
      expect(meta.match).toBe("all");
    });
  });

  describe("validateRule", () => {
    it("returns valid for correct frontmatter", () => {
      const content = `---
keywords: ["a", "b"]
match: any
---
body`;
      const result = validateRule(content);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("reports missing opening delimiter", () => {
      const result = validateRule("no frontmatter");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Missing opening --- frontmatter delimiter",
      );
    });

    it("reports missing closing delimiter", () => {
      const result = validateRule('---\nkeywords: ["a"]\n');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Missing closing --- frontmatter delimiter",
      );
    });

    it("reports empty keywords", () => {
      const content = `---
keywords: []
match: any
---
body`;
      const result = validateRule(content);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("keywords must be a non-empty array");
    });

    it("reports invalid match value", () => {
      const content = `---
keywords: ["a"]
match: sometimes
---
body`;
      const result = validateRule(content);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'match must be "any" or "all", got "sometimes"',
      );
    });

    it("reports non-array keywords", () => {
      const content = `---
keywords: "a"
match: any
---
body`;
      const result = validateRule(content);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("keywords must be a non-empty array");
    });
  });

  describe("discoverRules", () => {
    it("finds all .mdc files recursively", async () => {
      const tmp = path.join(os.tmpdir(), "bkg-rules-test-" + Date.now());
      await fs.mkdir(path.join(tmp, "sub"), { recursive: true });
      await fs.writeFile(
        path.join(tmp, "a.mdc"),
        '---\nkeywords: ["a"]\nmatch: any\n---\n',
      );
      await fs.writeFile(
        path.join(tmp, "sub", "b.mdc"),
        '---\nkeywords: ["b"]\nmatch: all\n---\n',
      );
      await fs.writeFile(path.join(tmp, "c.txt"), "not a rule");

      const rules = await discoverRules(tmp);
      expect(rules).toHaveLength(2);
      expect(rules.map((r) => path.basename(r.file))).toEqual([
        "a.mdc",
        "b.mdc",
      ]);
      expect(rules[0].metadata.keywords).toEqual(["a"]);
      expect(rules[1].metadata.keywords).toEqual(["b"]);
      expect(rules[1].metadata.match).toBe("all");
    });

    it("returns empty array for empty directory", async () => {
      const tmp = path.join(os.tmpdir(), "bkg-rules-empty-" + Date.now());
      await fs.mkdir(tmp, { recursive: true });
      const rules = await discoverRules(tmp);
      expect(rules).toEqual([]);
    });
  });

  describe("installRules", () => {
    it("copies only .mdc files to target", async () => {
      const src = path.join(os.tmpdir(), "bkg-rules-src-" + Date.now());
      const dst = path.join(os.tmpdir(), "bkg-rules-dst-" + Date.now());
      await fs.mkdir(path.join(src, "sub"), { recursive: true });
      await fs.writeFile(path.join(src, "a.mdc"), "rule a");
      await fs.writeFile(path.join(src, "b.txt"), "ignore me");
      await fs.writeFile(path.join(src, "sub", "c.mdc"), "rule c");

      await installRules(src, dst);

      const dstFiles = await fs.readdir(dst);
      expect(dstFiles).toEqual(["a.mdc", "sub"]);
      const subFiles = await fs.readdir(path.join(dst, "sub"));
      expect(subFiles).toEqual(["c.mdc"]);
      expect(await fs.readFile(path.join(dst, "a.mdc"), "utf8")).toBe("rule a");
    });
  });
});
