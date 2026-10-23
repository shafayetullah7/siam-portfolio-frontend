import { A } from "@solidjs/router";
import { Show } from "solid-js";
import type { WritingPublicDetail } from "~/lib/api/types/writing.types";

export type WritingArticleDetailViewProps = {
  detail: WritingPublicDetail;
  backHref: string;
  backLabel: string;
  showPermalink?: boolean;
};

function formatWhen(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}

export default function WritingArticleDetailView(
  props: WritingArticleDetailViewProps,
) {
  const d = () => props.detail;

  return (
    <article class="max-w-3xl min-w-0">
      <p class="mb-6">
        <A href={props.backHref} class="text-sm text-ink-muted no-underline hover:text-ink">
          ← {props.backLabel}
        </A>
      </p>

      <header class="space-y-3 border-b border-border pb-6">
        <h1 class="text-3xl font-semibold tracking-tight text-ink">{d().title}</h1>
        <Show when={d().subtitle?.trim()}>
          <p class="text-lg text-ink-muted">{d().subtitle}</p>
        </Show>
        <Show when={d().byline?.trim()}>
          <p class="text-sm text-ink-muted">{d().byline}</p>
        </Show>
        <p class="text-base text-ink">{d().summary}</p>
        <div class="flex flex-wrap gap-3 text-sm text-ink-muted">
          <Show when={d().readingTimeMinutes != null}>
            <span>{d().readingTimeMinutes} min read</span>
          </Show>
          <Show when={formatWhen(d().publishedAt)}>
            <span>Published {formatWhen(d().publishedAt)}</span>
          </Show>
          <Show when={formatWhen(d().updatedAt)}>
            <span>Updated {formatWhen(d().updatedAt)}</span>
          </Show>
        </div>
        <Show when={d().tags && d().tags!.length > 0}>
          <p class="text-sm text-ink-muted">Tags: {d().tags!.join(", ")}</p>
        </Show>
        <Show when={d().coverUrl && d().coverAlt?.trim()}>
          <img
            src={d().coverUrl!}
            alt={d().coverAlt ?? ""}
            class="mt-4 max-h-80 w-full rounded-lg object-cover"
          />
        </Show>
        <Show when={props.showPermalink}>
          <p class="text-sm text-ink-muted">
            Public URL:{" "}
            <a href={d().href} class="text-ink underline">
              {d().href}
            </a>
          </p>
        </Show>
      </header>

      <div class="mt-8">
        <p class="mb-3 text-sm text-ink-muted">
          Body preview uses plain Markdown source until rich rendering ships (WRIT9).
        </p>
        <pre
          class="whitespace-pre-wrap rounded-lg border border-border bg-surface-container-lowest p-4 font-mono text-sm text-ink"
        >
          {d().body || "(empty)"}
        </pre>
      </div>
    </article>
  );
}
