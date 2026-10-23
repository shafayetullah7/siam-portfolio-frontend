import { For, Show } from "solid-js";
import type { WritingPublicRelated } from "~/lib/api/types/writing.types";

export type WritingArticleRelatedSectionProps = {
  related: WritingPublicRelated;
};

function hasRelated(related: WritingPublicRelated): boolean {
  return (
    related.articles.length > 0 ||
    related.publications.length > 0 ||
    related.projects.length > 0 ||
    related.themes.length > 0
  );
}

export default function WritingArticleRelatedSection(
  props: WritingArticleRelatedSectionProps,
) {
  const r = () => props.related;

  return (
    <Show when={hasRelated(r())}>
      <section class="mt-12 space-y-8 border-t border-border pt-10">
        <h2 class="text-xl font-semibold text-ink">Related</h2>

        <Show when={r().publications.length > 0}>
          <div>
            <h3 class="text-sm font-medium text-ink-muted">Publications</h3>
            <ul class="mt-2 list-none space-y-2 p-0">
              <For each={r().publications}>
                {(pub) => (
                  <li>
                    <a
                      href={pub.href}
                      class="font-medium text-ink no-underline hover:underline"
                    >
                      {pub.title}
                    </a>
                    <p class="text-sm text-ink-muted">
                      {pub.authorsShort} · {pub.venue} ({pub.year})
                    </p>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>

        <Show when={r().projects.length > 0}>
          <div>
            <h3 class="text-sm font-medium text-ink-muted">Projects</h3>
            <ul class="mt-2 list-none space-y-2 p-0">
              <For each={r().projects}>
                {(project) => (
                  <li>
                    <a
                      href={project.href}
                      class="font-medium text-ink no-underline hover:underline"
                    >
                      {project.title}
                    </a>
                    <p class="text-sm text-ink-muted line-clamp-2">
                      {project.summary}
                    </p>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>

        <Show when={r().themes.length > 0}>
          <div>
            <h3 class="text-sm font-medium text-ink-muted">Research themes</h3>
            <ul class="mt-2 list-none space-y-2 p-0">
              <For each={r().themes}>
                {(theme) => (
                  <li>
                    <a
                      href={theme.href}
                      class="font-medium text-ink no-underline hover:underline"
                    >
                      {theme.title}
                    </a>
                    <p class="text-sm text-ink-muted line-clamp-2">
                      {theme.summary}
                    </p>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>

        <Show when={r().articles.length > 0}>
          <div>
            <h3 class="text-sm font-medium text-ink-muted">Articles</h3>
            <ul class="mt-2 list-none space-y-2 p-0">
              <For each={r().articles}>
                {(article) => (
                  <li>
                    <a
                      href={article.href}
                      class="font-medium text-ink no-underline hover:underline"
                    >
                      {article.title}
                    </a>
                    <p class="text-sm text-ink-muted line-clamp-2">
                      {article.summary}
                    </p>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>
      </section>
    </Show>
  );
}
