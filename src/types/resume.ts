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

import type { ComponentType } from 'react';

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic',
    name: '经典单栏',
    description: '传统上下布局，适合国企/传统行业',
    showPhoto: true,
    colors: { primary: '#1B3A5C', text: '#1A1A1A', background: '#FFFFFF', accent: '#2E86AB' },
  },
  {
    id: 'modern',
    name: '现代双栏',
    description: '左侧技能栏+右侧经历，适合互联网/外企',
    showPhoto: true,
    colors: { primary: '#2E86AB', text: '#333333', background: '#FFFFFF', accent: '#E67E22' },
  },
  {
    id: 'hybrid',
    name: '混合布局',
    description: '顶部概要+双栏正文，通用性强',
    showPhoto: false,
    colors: { primary: '#1B3A5C', text: '#2C3E50', background: '#F8F9FA', accent: '#27AE60' },
  },
];

export interface TemplateRendererProps {
  content: ResumeContent;
  config: TemplateConfig;
}

export type TemplateComponent = ComponentType<TemplateRendererProps>;
