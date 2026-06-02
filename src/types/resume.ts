export interface ResumeContent {
  basic: {
    name: string;
    photo?: string;
    phone: string;
    email: string;
    location: string;
    github?: string;
    website?: string;
  };
  education: Array<{
    school: string;
    major: string;
    degree: string;
    date: string;
  }>;
  experiences: Array<{
    projectName: string;
    role: string;
    date: string;
    description: string;
    techStack: string[];
  }>;
  skills: string[];
}

export interface ResumeVersion {
  id: string;
  jobTitle: string;
  jdText: string;
  templateId: string;
  matchScore: number;
  selectedExperiences: string[];
  selectedVariants: Record<string, string>;
  content: ResumeContent;
  language: 'zh' | 'en';
  createdAt: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  showPhoto: boolean;
  colors: {
    primary: string;
    text: string;
    background: string;
    accent: string;
  };
}
