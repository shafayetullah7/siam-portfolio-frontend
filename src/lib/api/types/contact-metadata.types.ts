/** Admin-only inquiry metadata (mirrors API `contact_messages.metadata`). */
export type ContactMessageMetadata = {
  ip?: string;
  userAgent?: string;
  honeypotTriggered?: boolean;
  turnstile?: { success: boolean; errorCodes?: string[] };
  locale?: string;
};
