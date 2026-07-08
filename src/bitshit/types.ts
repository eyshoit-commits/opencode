export type BitshitBlockerStatus = "open" | "in_vote" | "resolved" | "escalated"

export interface BlockerInput {
  taskId: string
  description: string
  context: Record<string, unknown>
  severity?: "low" | "medium" | "high" | "critical"
}

export interface BlockerRecord {
  id: string
  taskId: string
  description: string
  context: Record<string, unknown>
  status: BitshitBlockerStatus
  severity?: "low" | "medium" | "high" | "critical"
  createdAt: string
  resolvedAt?: string
  ratSessionId?: string
}

export interface RatInput {
  blockerId: string
  topic: string
  agents: string[]
}

export interface RatSession {
  id: string
  blockerId: string
  topic: string
  agents: string[]
  status: "pending" | "active" | "complete"
  startedAt: string
  completedAt?: string
  summary?: string
}

export interface VoteInput {
  sessionId: string
  agentId: string
  choice: "approve" | "reject" | "abstain"
  rationale?: string
}

export type VoteDecision = "approved" | "rejected" | "revise" | "blocked"

export interface VoteRecord {
  id: string
  sessionId: string
  agentId: string
  choice: "approve" | "reject" | "abstain"
  rationale?: string
  castAt: string
}

export interface ApprovalInput {
  voteSessionId: string
  context: Record<string, unknown>
}

export interface ApprovalDecision {
  decision: VoteDecision
  voteSummary: Record<string, number>
  decidedAt: string
  decidedBy: string
  isStub?: boolean
}

export interface MemoryInput {
  key: string
  content: string
  worktree?: string
  metadata?: Record<string, unknown>
}

export interface BitshitControlAdapter {
  reportBlocker(input: BlockerInput): Promise<BlockerRecord>
  startRat(input: RatInput): Promise<RatSession>
  recordVote(input: VoteInput): Promise<VoteRecord>
  requestApproval(input: ApprovalInput): Promise<ApprovalDecision>
  remember(input: MemoryInput): Promise<void>
}
