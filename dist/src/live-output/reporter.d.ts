export interface LiveOutputReporter {
    handle(event: unknown): void;
}
export declare function createLiveOutputReporter(): LiveOutputReporter;
