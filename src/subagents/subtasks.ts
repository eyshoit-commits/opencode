import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as os from "node:os"

export interface Subtask {
  id: string
  delegationId: string
  description: string
  status: "pending" | "running" | "complete" | "error" | "skipped"
  assignedAgent?: string
  result?: string
  error?: string
  createdAt: string
  updatedAt: string
}

function subtasksDir(): string {
  return process.env.BKG_OC_SUBTASKS_DIR ??
    path.join(os.homedir(), ".local", "share", "opencode", "subtasks")
}

function makeId(): string {
  return `st-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(subtasksDir(), { recursive: true })
}

function recordPath(id: string): string {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error("Invalid subtask id.")
  return path.join(subtasksDir(), `${id}.json`)
}

export async function createSubtask(input: {
  delegationId: string
  description: string
  assignedAgent?: string
}): Promise<Subtask> {
  await ensureDir()
  const now = new Date().toISOString()
  const subtask: Subtask = {
    id: makeId(),
    delegationId: input.delegationId,
    description: input.description,
    status: "pending",
    assignedAgent: input.assignedAgent,
    createdAt: now,
    updatedAt: now,
  }
  await fs.writeFile(recordPath(subtask.id), JSON.stringify(subtask, null, 2) + "\n", "utf8")
  return subtask
}

export async function updateSubtask(id: string, update: Partial<Subtask>): Promise<Subtask> {
  const subtask = await readSubtask(id)
  const { id: _id, createdAt: _createdAt, delegationId: _delegationId, ...mutable } = update
  Object.assign(subtask, mutable, { updatedAt: new Date().toISOString() })
  await fs.writeFile(recordPath(id), JSON.stringify(subtask, null, 2) + "\n", "utf8")
  return subtask
}

export async function readSubtask(id: string): Promise<Subtask> {
  const raw = await fs.readFile(recordPath(id), "utf8")
  return JSON.parse(raw) as Subtask
}

export async function listSubtasks(delegationId?: string): Promise<Subtask[]> {
  await ensureDir()
  const files = await fs.readdir(subtasksDir())
  const subtasks: Subtask[] = []
  for (const file of files.filter((f: string) => f.endsWith(".json"))) {
    try {
      const s = JSON.parse(await fs.readFile(path.join(subtasksDir(), file), "utf8")) as Subtask
      if (!delegationId || s.delegationId === delegationId) {
        subtasks.push(s)
      }
    } catch {
      // skip damaged records
    }
  }
  return subtasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
