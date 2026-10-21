import type { Paginated } from "./index";

export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  mfaEnabled: boolean;
}

export interface AdminRegisterResult {
  pendingId: string;
  otpExpiresAt: string;
}

export interface AdminRegistrationStatus {
  registrationEnabled: boolean;
  hasPending: boolean;
  otpExpiresAt?: string;
  locked?: boolean;
  nextResendAt?: string;
}

export interface AdminForgotPasswordResult {
  message: string;
}

export interface SiteSettingsAdmin {
  id: string;
  siteName: string;
  defaultMetaDescription: string | null;
  footerText: string | null;
  researchHubIntro: string | null;
  faviconUrl: string | null;
  faviconMediaId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NavItemAdmin {
  id: string;
  label: string;
  path: string;
  sortOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SitePageAdmin {
  id: string;
  slug: string;
  title: string;
  body: string;
  publishStatus: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Admin research theme (A04; R2+ API). */
export interface ResearchThemeAdmin {
  id: string;
  slug: string;
  title: string;
  summary: string;
  themeStatus: 'ongoing' | 'completed';
  problem: string;
  significance: string | null;
  objectives: string | null;
  approach: string | null;
  findings: string | null;
  limitations: string | null;
  futureWork: string | null;
  tags: string[] | null;
  linkLabel: string | null;
  coverMediaId: string | null;
  sortOrder: number;
  featuredOnHome: boolean;
  publishStatus: string;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  collaborators: Array<{
    name: string;
    role?: string | null;
    url?: string | null;
  }> | null;
  acknowledgments: string | null;
  funding: string | null;
  resources: Array<{
    id: string;
    label: string;
    url: string;
    resourceType: 'code' | 'data' | 'demo' | 'paper' | 'other';
    sortOrder: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

/** Admin media library row (A10). Uploads are server-side only — no Cloudinary keys in the browser. */
export interface MediaAdmin {
  id: string;
  fileName: string;
  url: string;
  mimeType: string | null;
  size: number;
  alt: string | null;
  caption: string | null;
  license: string | null;
  usesCount: number;
  createdAt: string;
  updatedAt: string;
}

export type MediaListResponse = Paginated<MediaAdmin>;
