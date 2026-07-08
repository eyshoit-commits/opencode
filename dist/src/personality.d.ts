export interface PersonalityPreset {
    traits: string[];
    tone: string;
    constraints: string[];
}
export declare function getPersonality(role: string): PersonalityPreset;
