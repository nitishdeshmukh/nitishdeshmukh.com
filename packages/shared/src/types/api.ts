export interface Role {
  id: number;
  title: string;
  order: number;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

export interface StackItem {
  id: number;
  name: string;
  iconUrl: string;
  category: string;
}

export interface ExperienceEntry {
  id: number;
  company: string;
  role: string;
  description: string | null;
  logoUrl: string | null;
  startDate: string;
  endDate: string | null;
}

export interface EducationEntry {
  id: number;
  institution: string;
  degree: string;
  field: string;
  logoUrl: string | null;
  startYear: number;
  endYear: number | null;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  contentMdx: string | null;
  coverUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  tags: string[];
  featured: boolean | null;
  order: number;
  publishedAt: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  contentMdx: string | null;
  coverUrl: string | null;
  tags: string[];
  readingTime: number | null;
  publishedAt: string | null;
  updatedAt: string;
}

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  avatarUrl: string | null;
  approved: boolean | null;
  createdAt: string;
}

export interface AudioAsset {
  id: number;
  title: string;
  artist: string | null;
  duration: number | null;
  fileKey: string;
  mimeType: string;
  sizeBytes: number | null;
  createdAt: string;
}

export interface SiteConfig {
  key: string;
  value: string;
  updatedAt: string;
}

export interface ProfileResponse {
  name: string;
  bio: string;
  email: string;
  profileImage: string;
  location: string;
  roles: Role[];
  socialLinks: SocialLink[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
