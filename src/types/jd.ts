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
}

export interface MatchResult {
  score: number;
  selectedExperiences: Array<{
    experienceId: string;
    variantId?: string;
    relevance: number;
  }>;
  gaps: Array<{
    keyword: string;
    suggestion: string;
  }>;
  suggestions: string[];
}
