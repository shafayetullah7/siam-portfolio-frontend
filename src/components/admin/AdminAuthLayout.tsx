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
    <div class="mx-auto max-w-md py-16">
      <div class="rounded-lg border border-border bg-surface px-6 py-8 shadow-sm">
        <h1 class="text-2xl font-bold text-ink">{props.title}</h1>
        <Show when={props.description}>
          <p class="mt-2 text-sm text-ink-muted">{props.description}</p>
        </Show>
        {props.children}
      </div>
      <Show when={footer()} keyed>
        {(slot) => <div class="mt-6">{slot}</div>}
      </Show>
    </div>
  );
}
