import type { ContactMessageMetadata } from "./contact-metadata.types";

export type ContactInquiryStatus =
  | "new"
  | "read"
  | "replied"
  | "archived"
  | "spam";

export type PublicContactConfig = {
  formEnabled: boolean;
  intro: string | null;
  collaborationGuidance: string | null;
  responseTimeNote: string | null;
  categories: string[];
  consentText: string | null;
  successMessage: string | null;
  publicEmail: string | null;
  showEmailOnPage: boolean;
  /** Present when Turnstile is enabled server-side (MSG3+). */
  turnstileSiteKey?: string | null;
};

export type ContactMessageListItem = {
  id: string;
  senderName: string;
  senderEmail: string;
  category: string | null;
  status: ContactInquiryStatus;
  isRead: boolean;
  submittedAt: string;
  bodySnippet?: string | null;
};

export type ContactMessageAdmin = {
  id: string;
  status: ContactInquiryStatus;
  isRead: boolean;
  category: string | null;
  senderName: string;
  senderEmail: string;
  affiliation: string | null;
  subject: string | null;
  body: string;
  consentGiven: boolean;
  consentTextVersion: string | null;
  submittedAt: string;
  readAt: string | null;
  repliedAt: string | null;
  archivedAt: string | null;
  adminNotes: string | null;
  metadata: ContactMessageMetadata | null;
  createdAt: string;
  updatedAt: string;
};
