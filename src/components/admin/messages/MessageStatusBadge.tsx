import type { ContactInquiryStatus } from "~/lib/api/types/contact.types";

const LABELS: Record<ContactInquiryStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
  spam: "Spam",
};

const TONE: Record<ContactInquiryStatus, string> = {
  new: "bg-primary-container text-on-primary-container ring-primary/20",
  read: "bg-surface text-ink-muted ring-border",
  replied: "bg-secondary-container text-on-secondary-container ring-border",
  archived: "bg-surface text-ink-muted ring-border",
  spam: "bg-error-container text-on-error-container ring-error/20",
};

export type MessageStatusBadgeProps = {
  status: ContactInquiryStatus;
};

export default function MessageStatusBadge(props: MessageStatusBadgeProps) {
  return (
    <span
      class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${TONE[props.status]}`}
    >
      {LABELS[props.status]}
    </span>
  );
}
