import { A } from "@solidjs/router";
import { Show } from "solid-js";
import ArticleMarkdownBody from "~/components/writing/ArticleMarkdownBody";
import type { WritingPublicDetail } from "~/lib/api/types/writing.types";

export type WritingArticleDetailViewProps = {
  detail: WritingPublicDetail;
  backHref: string;
  backLabel: string;
  showPermalink?: boolean;
  /** Shown when `detail.byline` is empty (e.g. site owner name). */
  defaultAuthor?: string;
};

function formatWhen(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}

function authorLine(
  byline: string | null | undefined,
  defaultAuthor?: string,
): string | null {
  const trimmed = byline?.trim();
  if (trimmed) return trimmed;
  const fallback = defaultAuthor?.trim();
  return fallback || null;
}

export default function WritingArticleDetailView(
  props: WritingArticleDetailViewProps,
) {
  const d = () => props.detail;
  const updatedLabel = () =>
    formatWhen(d().materiallyUpdatedAt ?? d().updatedAt);
  const showNav = () => Boolean(d().prevSlug || d().nextSlug);

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
        <Show when={authorLine(d().byline, props.defaultAuthor)}>
          {(name) => <p class="text-sm text-ink-muted">{name()}</p>}
        </Show>
        <p class="text-base text-ink">{d().summary}</p>
        <div class="flex flex-wrap gap-3 text-sm text-ink-muted">
          <Show when={d().readingTimeMinutes != null}>
            <span>{d().readingTimeMinutes} min read</span>
          </Show>
          <Show when={formatWhen(d().publishedAt)}>
            <span>Published {formatWhen(d().publishedAt)}</span>
          </Show>
          <Show when={updatedLabel()}>
            <span>Updated {updatedLabel()}</span>
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
        <ArticleMarkdownBody markdown={d().body || ""} />
      </div>

      <Show when={showNav()}>
        <nav
          class="mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between"
          aria-label="Article navigation"
        >
          <Show
            when={d().prevSlug}
            fallback={<div class="hidden sm:block sm:flex-1" aria-hidden="true" />}
          >
            {(slug) => (
              <A
                href={`/writing/${slug()}`}
                class="text-sm font-medium text-ink no-underline hover:underline"
              >
                ← Previous article
              </A>
            )}
          </Show>
          <Show when={d().nextSlug}>
            {(slug) => (
              <A
                href={`/writing/${slug()}`}
                class="text-sm font-medium text-ink no-underline hover:underline sm:text-right"
              >
                Next article →
              </A>
            )}
          </Show>
        </nav>
      </Show>
    </article>
  );
}
