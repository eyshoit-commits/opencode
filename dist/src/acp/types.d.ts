export type AcpReviewGateMode = "browser" | "disabled";
export interface AcpCompatibilityConfig {
    enabled: boolean;
    dashboardPort: number;
    remoteMode: boolean;
    browser?: string;
    reviewGateMode: AcpReviewGateMode;
    reviewGateTimeoutSeconds: number;
    unsupportedSlashCommands: string[];
}
