export interface JdRequirement {
  category: 'skill' | 'experience' | 'education' | 'soft-skill';
  keyword: string;
  importance: 'required' | 'preferred';
  yearsRequired?: number;
}

export interface JdAnalysis {
  title: string;
  company?: string;
  techStack: string[];
  requirements: JdRequirement[];
  summary: string;
  rawText: string;
}

export interface MatchGap {
  requirement: JdRequirement;
  matched: boolean;
  suggestion?: string;
}

export interface MatchResult {
  score: number;
  matchedExperiences: Array<{
    experienceId: string;
    variantId: string;
    relevance: number;
  }>;
  gaps: MatchGap[];
  suggestions: string[];
}
