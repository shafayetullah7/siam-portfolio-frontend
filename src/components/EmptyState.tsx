import { children, Show, type JSX } from "solid-js";

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: JSX.Element;
  /** `list` — left-aligned, tighter padding for admin tables */
  variant?: "default" | "list";
}

export default function EmptyState(props: EmptyStateProps) {
  const variant = () => props.variant ?? "default";
  const resolved = children(() => props.children);

  return (
    <div
      class="siam-empty-state"
      classList={{
        "text-left py-6 px-4": variant() === "list",
      }}
      role="status"
    >
      <p class="text-base font-semibold text-ink">{props.title}</p>
      <Show when={props.description}>
        <p class="mt-2 text-sm text-ink-muted">{props.description}</p>
      </Show>
      <Show when={resolved()} keyed>
        {(slot) => <div class="mt-4">{slot}</div>}
      </Show>
    </div>
  );
}
