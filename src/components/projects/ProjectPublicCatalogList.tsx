import { A } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import EmptyState from "~/components/EmptyState";
import ProjectPublicCard from "~/components/projects/ProjectPublicCard";
import type { ProjectPublicCard as ProjectPublicCardType } from "~/lib/api/types/project.types";

export type ProjectPublicCatalogListProps = {
  items: ProjectPublicCardType[];
  featuredItems?: ProjectPublicCardType[];
  hasActiveFilters?: boolean;
};

export default function ProjectPublicCatalogList(
  props: ProjectPublicCatalogListProps,
) {
  const featured = createMemo(() => props.featuredItems ?? []);
  const rest = createMemo(() => props.items);
  const hasAny = createMemo(
    () => featured().length > 0 || rest().length > 0,
  );

  return (
    <Show
      when={hasAny()}
      fallback={
        <EmptyState
          variant="list"
          title={
            props.hasActiveFilters
              ? "No matching projects"
              : "No projects published yet"
          }
          description={
            props.hasActiveFilters
              ? "Try clearing filters or broadening your search."
              : "Published case studies and artifacts will appear here."
          }
        >
          <div class="flex flex-wrap justify-center gap-2">
            <A href="/research" class="siam-btn-secondary no-underline">
              Research
            </A>
            <A href="/publications" class="siam-btn-secondary no-underline">
              Publications
            </A>
          </div>
        </EmptyState>
      }
    >
      <Show when={featured().length > 0}>
        <section class="mb-10" aria-labelledby="featured-projects-heading">
          <h2
            id="featured-projects-heading"
            class="mb-4 text-lg font-semibold text-brand-deep"
          >
            Featured
          </h2>
          <ul
            class="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            <For each={featured()}>
              {(item) => (
                <li>
                  <ProjectPublicCard item={item} featured />
                </li>
              )}
            </For>
          </ul>
        </section>
      </Show>
      <Show when={rest().length > 0}>
        <section aria-labelledby="all-projects-heading">
          <h2
            id="all-projects-heading"
            class="mb-4 text-lg font-semibold text-brand-deep"
          >
            {featured().length > 0 ? "All projects" : "Projects"}
          </h2>
          <ul
            class="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            <For each={rest()}>
              {(item) => (
                <li>
                  <ProjectPublicCard item={item} />
                </li>
              )}
            </For>
          </ul>
        </section>
      </Show>
    </Show>
  );
}
