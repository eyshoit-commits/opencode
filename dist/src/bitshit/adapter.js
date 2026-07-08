function makeId() {
    return crypto.randomUUID();
}
function now() {
    return new Date().toISOString();
}
/**
 * Compatibility-only adapter.
 *
 * Use createRuntimeBitshitAdapter() from ./runtime-adapter.js for real persisted
 * blocker, Rat, vote and memory behavior. This adapter intentionally avoids
 * random decisions and marks approval output as a stub so callers cannot mistake
 * it for production state.
 */
export function createBitshitAdapter() {
    return {
        async reportBlocker(input) {
            return {
                id: makeId(),
                taskId: input.taskId,
                description: input.description,
                context: input.context,
                status: "open",
                severity: input.severity,
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
        async requestApproval(_input) {
            return {
                decision: "blocked",
                voteSummary: { approve: 0, reject: 0, abstain: 0, total: 0 },
                decidedAt: now(),
                decidedBy: "bitshit-adapter-stub",
                isStub: true,
            };
        },
        async remember(_input) {
            return;
        },
    };
}
