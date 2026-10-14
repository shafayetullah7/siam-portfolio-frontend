import type { JSX } from "solid-js";

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: JSX.Element;
}

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div class="siam-empty-state" role="status">
      <p class="text-base font-semibold text-ink">{props.title}</p>
      {props.description && (
        <p class="mt-2 text-sm text-ink-muted">{props.description}</p>
      )}
      {props.children && <div class="mt-4">{props.children}</div>}
    </div>
  );
}
