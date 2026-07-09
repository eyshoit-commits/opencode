import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { appendWorktreeMemory, readWorktreeMemory, syncWorktreeMemory } from "../src/memory/worktree-sync.js"

describe("worktree memory sync", () => {
  let worktree: string
  let targetDir: string

  beforeEach(async () => {
    worktree = `test-${Date.now()}`
    targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "bkg-worktree-sync-"))
  })

  afterEach(async () => {
    await fs.rm(path.join(os.homedir(), ".local", "share", "opencode", "memory", "worktrees", worktree), { recursive: true, force: true })
    await fs.rm(targetDir, { recursive: true, force: true })
  })

  it("returns empty array for unknown worktree", async () => {
    expect(await readWorktreeMemory("nonexistent-worktree")).toEqual([])
  })

  it("appends and reads worktree memory", async () => {
    const record = await appendWorktreeMemory(worktree, {
      key: "decision",
      content: "Ship after fix",
      metadata: { agent: "builder" },
    })

    expect(record.id).toBeTruthy()
    expect(record.createdAt).toBeTruthy()
    expect(record.updatedAt).toBeTruthy()

    const records = await readWorktreeMemory(worktree)
    expect(records).toHaveLength(1)
    expect(records[0].key).toBe("decision")
    expect(records[0].content).toBe("Ship after fix")
    expect(records[0].metadata).toEqual({ agent: "builder" })
  })

  it("appends multiple records and preserves order", async () => {
    await appendWorktreeMemory(worktree, { key: "a", content: "first" })
    await appendWorktreeMemory(worktree, { key: "b", content: "second" })

    const records = await readWorktreeMemory(worktree)
    expect(records).toHaveLength(2)
    expect(records[0].content).toBe("first")
    expect(records[1].content).toBe("second")
  })

  it("syncs worktree memory to target directory", async () => {
    await appendWorktreeMemory(worktree, { key: "sync-test", content: "synced" })
    await syncWorktreeMemory(worktree, targetDir)

    const files = await fs.readdir(targetDir)
    expect(files).toHaveLength(1)
    expect(files[0]).toContain("worktree-")
    expect(files[0]).toContain("-memory.json")

    const raw = await fs.readFile(path.join(targetDir, files[0]), "utf8")
    const records = JSON.parse(raw)
    expect(records).toHaveLength(1)
    expect(records[0].content).toBe("synced")
  })

  it("sanitizes worktree names in file paths", async () => {
    const dirty = "feature/abc@123"
    await appendWorktreeMemory(dirty, { key: "k", content: "v" })
    await syncWorktreeMemory(dirty, targetDir)

    const files = await fs.readdir(targetDir)
    expect(files[0]).not.toContain("/")
    expect(files[0]).not.toContain("@")
  })
})
