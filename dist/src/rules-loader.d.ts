export interface RuleEntry {
    file: string;
    metadata: RuleMetadata;
}
export interface RuleMetadata {
    keywords: string[];
    match: "any" | "all";
    description?: string;
}
/**
 * Recursively find all .mdc files under dir, parse their frontmatter,
 * and return them as RuleEntry objects.
 */
export declare function discoverRules(dir: string): Promise<RuleEntry[]>;
/**
 * Validate a rule file's frontmatter.
 */
export declare function validateRule(content: string): {
    valid: boolean;
    errors: string[];
};
/**
 * Copy all .mdc rule files from sourceDir to targetDir, preserving subdirectory structure.
 */
export declare function installRules(sourceDir: string, targetDir: string): Promise<void>;
/**
 * Parse and extract metadata from a rule file's frontmatter.
 */
export declare function getRuleMetadata(content: string): RuleMetadata;
