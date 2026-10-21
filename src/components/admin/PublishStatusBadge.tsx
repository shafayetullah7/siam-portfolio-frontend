const LABELS: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  scheduled: "Scheduled",
  archived: "Archived",
};

export type PublishStatusBadgeProps = {
  status: string;
};

export default function PublishStatusBadge(props: PublishStatusBadgeProps) {
  const label = () => LABELS[props.status] ?? props.status;
  return (
    <span
      class="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-ink-muted ring-1 ring-border"
    >
      {label()}
    </span>
  );
}
