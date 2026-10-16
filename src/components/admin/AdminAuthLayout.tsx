import { children, Show, type JSX } from "solid-js";

export type AdminAuthLayoutProps = {
  title: string;
  description?: string;
  children: JSX.Element;
  footer?: JSX.Element;
};

/** Centered card for all public admin auth routes (login, register, verify, forgot, reset). */
export default function AdminAuthLayout(props: AdminAuthLayoutProps) {
  const footer = children(() => props.footer);

  return (
    <div class="flex w-full flex-col items-center px-4 py-8 sm:py-10">
      <div class="mb-8 text-center" aria-hidden="true">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">SIAM</p>
        <p class="mt-1 text-lg font-semibold tracking-tight text-ink">Admin</p>
      </div>

      <div class="siam-card w-full max-w-md overflow-hidden">
        <div class="h-1 bg-primary" />
        <div class="px-6 py-8 sm:px-8">
          <h1 class="text-2xl font-bold tracking-tight text-ink">{props.title}</h1>
          <Show when={props.description}>
            <p class="mt-2 text-sm leading-relaxed text-ink-muted">{props.description}</p>
          </Show>
          {props.children}
        </div>
      </div>

      <Show when={footer()} keyed>
        {(slot) => (
          <div class="mt-6 w-full max-w-md text-center text-sm text-ink-muted">{slot}</div>
        )}
      </Show>
    </div>
  );
}
