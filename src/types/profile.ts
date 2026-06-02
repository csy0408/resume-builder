export interface BasicInfo {
  name: string;
  photo?: string;
  phone: string;
  email: string;
  location: string;
  github?: string;
  website?: string;
}

export interface Education {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface ExperienceVariant {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  language: 'zh' | 'en';
}

export interface Experience {
  id: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate?: string;
  techStack: string[];
  baseDescription: string;
  variants: ExperienceVariant[];
  source: 'ai-scan' | 'resume-parse' | 'manual';
  sourcePath?: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  level?: string;
}

export interface UserProfile {
  basic: BasicInfo;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  updatedAt: string;
}

export const EMPTY_PROFILE: UserProfile = {
  basic: {
    name: '',
    phone: '',
    email: '',
    location: '',
  },
  education: [],
  experiences: [],
  skills: [],
  updatedAt: new Date().toISOString(),
};
