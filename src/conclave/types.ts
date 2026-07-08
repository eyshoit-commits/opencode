export interface ConclaveAgentProfile {
  id: string
  name: string
  role: string
  focus: string
}

export interface ConclaveClaim {
  text: string
  confidence: number
}

export interface ConclaveAgentResponse {
  agentId: string
  agentName: string
  role: string
  claims: ConclaveClaim[]
  reasoning: string
  uncertainties: string[]
  answer: string
}

export interface ConclaveRound {
  round: number
  responses: ConclaveAgentResponse[]
  critique?: ConclaveCritique
}

export interface ConclaveCritique {
  captainId: string
  consensus: number
  uncertaintyImprovement: number
  openIssues: string[]
  stop: boolean
  reason: "consensus_reached" | "max_rounds" | "needs_more_rounds" | "blocked"
}

export interface ConclaveSession {
  id: string
  query: string
  maxRounds: number
  consensusThreshold: number
  agents: ConclaveAgentProfile[]
  captain: ConclaveAgentProfile
  rounds: ConclaveRound[]
  finalAnswer?: string
  status: "pending" | "active" | "complete" | "blocked"
  createdAt: string
  updatedAt: string
}
