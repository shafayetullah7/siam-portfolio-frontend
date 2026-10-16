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
  hasPending: boolean;
  otpExpiresAt?: string;
  locked?: boolean;
}

export interface AdminForgotPasswordResult {
  message: string;
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
