import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createShortTermMemory,
  exportShortTermMemory,
  importShortTermMemory,
} from "../src/memory/short-term.js";

describe("short-term memory", () => {
  let store: ReturnType<typeof createShortTermMemory>;
  let tmpDir: string;
  let originalStorePath: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "bkg-short-term-"));
    originalStorePath = path.join(
      os.homedir(),
      ".local",
      "share",
      "opencode",
      "memory",
      "short-term.json",
    );
    // Override store path via env isn't supported, so we test with the real path but clean up
    store = createShortTermMemory();
  });

  afterEach(async () => {
    // Clean up any records created during the test
    const records = await store.list();
    for (const record of records) {
      await store.remove(record.id);
    }
  });

  it("appends and reads a record", async () => {
    const record = await store.append({
      key: "decision",
      content: "Ship after fix",
      metadata: { agent: "builder" },
    });

    expect(record.id).toBeTruthy();
    expect(record.createdAt).toBeTruthy();
    expect(record.updatedAt).toBeTruthy();

    const read = await store.read(record.id);
    expect(read).toEqual(record);
  });

  it("lists records with key filter", async () => {
    await store.append({ key: "a", content: "first" });
    await store.append({ key: "b", content: "second" });
    await store.append({ key: "a", content: "third" });

    const aRecords = await store.list({ key: "a" });
    expect(aRecords).toHaveLength(2);
    expect(aRecords.every((r) => r.key === "a")).toBe(true);
  });

  it("lists records with worktree filter", async () => {
    await store.append({ key: "k1", content: "wt1", worktree: "wt-a" });
    await store.append({ key: "k2", content: "wt2", worktree: "wt-b" });

    const wtA = await store.list({ worktree: "wt-a" });
    expect(wtA).toHaveLength(1);
    expect(wtA[0].worktree).toBe("wt-a");
  });

  it("searches records by content and key", async () => {
    await store.append({ key: "decision", content: "Ship after fix" });
    await store.append({ key: "note", content: "Ship the hotfix" });

    const results = await store.search("Ship");
    expect(results).toHaveLength(2);
  });

  it("removes records", async () => {
    const record = await store.append({ key: "temp", content: "remove me" });
    expect(await store.read(record.id)).not.toBeNull();

    await store.remove(record.id);
    expect(await store.read(record.id)).toBeNull();
  });

  it("supports pagination via limit and offset", async () => {
    for (let i = 0; i < 5; i++) {
      await store.append({ key: `k${i}`, content: `content ${i}` });
    }

    const page1 = await store.list({ limit: 2, offset: 0 });
    expect(page1).toHaveLength(2);

    const page2 = await store.list({ limit: 2, offset: 2 });
    expect(page2).toHaveLength(2);
    expect(page2[0].key).not.toBe(page1[0].key);
  });

  it("exports and imports records", async () => {
    await store.append({
      key: "export-test",
      content: "export me",
      worktree: "wt-1",
    });

    const exportPath = path.join(tmpDir, "export.json");
    await exportShortTermMemory(exportPath);

    const raw = await fs.readFile(exportPath, "utf8");
    const exported = JSON.parse(raw) as ReturnType<typeof store.list>;
    expect(exported).toHaveLength(1);

    // Clear the shared store so the import target starts empty.
    const existing = await store.list();
    for (const record of existing) {
      await store.remove(record.id);
    }

    const store2 = createShortTermMemory();
    const imported = await importShortTermMemory(exportPath, store2);
    expect(imported).toHaveLength(1);
    expect(imported[0].content).toBe("export me");

    const all = await store2.list();
    expect(all).toHaveLength(1);
  });

  it("import skips duplicate records", async () => {
    await store.append({ key: "dup", content: "same", worktree: "wt" });

    const exportPath = path.join(tmpDir, "dup.json");
    await exportShortTermMemory(exportPath);

    const imported = await importShortTermMemory(exportPath);
    expect(imported).toHaveLength(0);
  });
});
