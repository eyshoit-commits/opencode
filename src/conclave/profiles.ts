import type { ConclaveAgentProfile } from "./types.js"

export const defaultConclaveCaptain: ConclaveAgentProfile = {
  id: "bkg-conclave-captain",
  name: "Captain",
  role: "Moderator and synthesizer",
  focus: "Critique agent responses, score consensus, identify open issues and synthesize a final answer.",
}

export const defaultConclaveAgents: ConclaveAgentProfile[] = [
  {
    id: "bkg-conclave-facts",
    name: "Facts",
    role: "Research and evidence",
    focus: "Check factual claims, source quality, empirical evidence and missing context.",
  },
  {
    id: "bkg-conclave-logic",
    name: "Logic",
    role: "Logic, math and code",
    focus: "Check formal correctness, implementation risk, edge cases and technical feasibility.",
  },
  {
    id: "bkg-conclave-alt",
    name: "Alternative",
    role: "Creative and alternative perspectives",
    focus: "Challenge assumptions, UX, product impact, unusual solutions and unintended consequences.",
  },
]
