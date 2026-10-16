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
  faviconUrl: string | null;
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
