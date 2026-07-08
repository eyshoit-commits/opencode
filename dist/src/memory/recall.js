const registeredAdapters = new Map();
export function registerRecallAdapter(adapter) {
    registeredAdapters.set(adapter.name, adapter);
}
export function getRecallAdapter(name) {
    return registeredAdapters.get(name);
}
export function listRecallAdapters() {
    return Array.from(registeredAdapters.values());
}
export async function recallFromExternal(query, adapterName, context) {
    if (adapterName) {
        const adapter = registeredAdapters.get(adapterName);
        if (!adapter)
            throw new Error(`Recall adapter "${adapterName}" not found`);
        return adapter.recall(query, context);
    }
    for (const adapter of registeredAdapters.values()) {
        const result = await adapter.recall(query, context);
        if (result)
            return result;
    }
    return null;
}
