import { Show } from "solid-js";

export type AdminAuthStatusBannerProps = {
  variant?: "info" | "success";
  children: string;
};

/** Inline status on public admin auth pages (session expired, reset success, etc.). */
export default function AdminAuthStatusBanner(props: AdminAuthStatusBannerProps) {
  const variant = () => props.variant ?? "info";

  return (
    <Show when={props.children}>
      <p
        classList={{
          "mt-6": true,
          "rounded-md border border-border bg-surface-muted px-4 py-3 text-sm text-ink-muted":
            variant() === "info",
          "siam-alert-success": variant() === "success",
        }}
        role="status"
      >
        {props.children}
      </p>
    </Show>
  );
}
