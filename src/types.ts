/**
 * LifeGraph AI - TypeScript Types
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  careerGoal?: string;
  targetRole?: string;
}

export type DocumentCategory =
  | 'Projects'
  | 'Skills'
  | 'Certificates'
  | 'Achievements'
  | 'Internships'
  | 'Research'
  | 'Resume'
  | 'Portfolio'
  | 'Open Source'
  | 'Academics'
  | 'Leadership'
  | 'Hackathons'
  | 'Competitions'
  | 'Publications'
  | 'Others';

export interface DocumentMetadata {
  name: string;
  college?: string;
  university?: string;
  skills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  libraries: string[];
  projects: string[];
  achievements: string[];
  internships: string[];
  certificates: string[];
  organizations: string[];
  hackathons: string[];
  dates: string[];
  awards: string[];
  cgpa?: string;
  researchPapers: string[];
  patents: string[];
  technologies: string[];
  softSkills: string[];
  responsibilities: string[];
  companies: string[];
  jobRoles: string[];
  mentions: string[];
  summary: string;
}

export interface VersionItem {
  version: number;
  name: string;
  updatedAt: string;
  size: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'ppt' | 'image' | 'zip' | 'txt' | 'url';
  category: DocumentCategory;
  uploadDate: string;
  size: string; // e.g. "1.2 MB"
  url?: string; // external or local preview URL
  contentText: string;
  metadata: DocumentMetadata;
  versionHistory: VersionItem[];
}

export type NodeType = 'document' | 'skill' | 'project' | 'certificate' | 'internship' | 'achievement' | 'career';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  category?: DocumentCategory;
  docId?: string; // If tied to a specific original document
  summary?: string;
  details?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  animated?: boolean;
}

export interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  description: string;
  category: DocumentCategory | 'Career';
  documentId?: string;
  nodeId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
  relatedDocIds?: string[];
}

export interface SuggestedLearningItem {
  title: string;
  platform: string;
  url: string;
  desc: string;
}

export interface RecommendedJobItem {
  role: string;
  company: string;
  salary: string;
  fit: number; // percentage
}

export interface GapAnalysisItem {
  title: string;
  recommendation: string;
  roadmap: string[];
}

export interface CareerInsights {
  careerReadinessScore: number;
  scores: {
    experience: number;
    leadership: number;
    technical: number;
    research: number;
    openSource: number;
    communication: number;
  };
  strongSkills: string[];
  weakSkills: string[];
  missingCertifications: string[];
  missingProjects: string[];
  suggestedLearning: SuggestedLearningItem[];
  recommendedJobs: RecommendedJobItem[];
  gapAnalysis: GapAnalysisItem[];
}

export interface ResumeTemplateData {
  title: string;
  summary: string;
  skills: string[];
  projects: { name: string; desc: string; technologies: string[] }[];
  experience: { role: string; company: string; duration: string; bullets: string[] }[];
  education: { degree: string; institution: string; year: string; gpa?: string }[];
  certificates: string[];
}

export interface PortfolioData {
  hero: { title: string; subtitle: string };
  about: string;
  skills: string[];
  projects: { title: string; desc: string; tags: string[]; link?: string }[];
  experience: { role: string; company: string; period: string; desc: string }[];
  achievements: string[];
}
