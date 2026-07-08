function makeId() {
    return crypto.randomUUID();
}
function now() {
    return new Date().toISOString();
}
export function createBitshitAdapter() {
    return {
        async reportBlocker(input) {
            return {
                id: makeId(),
                taskId: input.taskId,
                description: input.description,
                context: input.context,
                status: "open",
                createdAt: now(),
            };
        },
        async startRat(input) {
            return {
                id: makeId(),
                blockerId: input.blockerId,
                topic: input.topic,
                agents: input.agents,
                status: "active",
                startedAt: now(),
            };
        },
        async recordVote(input) {
            return {
                id: makeId(),
                sessionId: input.sessionId,
                agentId: input.agentId,
                choice: input.choice,
                rationale: input.rationale,
                castAt: now(),
            };
        },
        async requestApproval(input) {
            const decisions = ["approved", "rejected", "revise", "blocked"];
            return {
                decision: decisions[Math.floor(Math.random() * decisions.length)],
                voteSummary: { approve: 0, reject: 0, abstain: 0 },
                decidedAt: now(),
                decidedBy: "bitshit-adapter-stub",
            };
        },
        async remember(_input) {
            return;
        },
    };
}
