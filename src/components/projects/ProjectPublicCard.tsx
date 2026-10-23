import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import LandingContentLink from "~/components/landing/LandingContentLink";
import type { ProjectPublicCard as ProjectPublicCardType } from "~/lib/api/types/project.types";
import {
  PROJECT_RESOURCE_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_LABELS,
} from "~/lib/projects/projectLabels";
import { ChevronRight } from "~/icons";

export type ProjectPublicCardProps = {
  item: ProjectPublicCardType;
  featured?: boolean;
};

export default function ProjectPublicCard(props: ProjectPublicCardProps) {
  const { item } = props;
  const primary = () => item.primaryResource;

  return (
    <LandingContentLink
      href={item.href}
      ariaLabel={`View project: ${item.title}`}
      class={`group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md no-underline ${
        props.featured ? "ring-1 ring-primary/25" : ""
      }`}
    >
      <div
        class="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-primary/5 transition-transform group-hover:scale-110"
        aria-hidden="true"
      />
      <Show
        when={
          item.coverUrl &&
          (item.coverAlt?.trim() ?? "") !== ""
        }
      >
        <div class="-mx-6 -mt-6 mb-4 aspect-[16/10] overflow-hidden bg-surface-muted">
          <img
            src={item.coverUrl!}
            alt={item.coverAlt!.trim()}
            loading="lazy"
            decoding="async"
            class="size-full object-cover"
          />
        </div>
      </Show>
      <div class="relative">
        <div class="mb-2 flex flex-wrap gap-2">
          <span class="rounded bg-surface-container px-2 py-0.5 font-mono text-xs text-primary">
            {PROJECT_TYPE_LABELS[item.projectType]}
          </span>
          <span class="rounded bg-surface-container px-2 py-0.5 font-mono text-xs text-secondary">
            {PROJECT_STATUS_LABELS[item.projectStatus]}
          </span>
        </div>
        <h3 class="siam-headline-md mb-2 font-medium text-brand-deep">{item.title}</h3>
        <p class="mb-3 text-sm text-on-surface-variant">{item.summary}</p>
        <Show when={item.ownerContribution}>
          <p class="mb-3 text-sm text-ink-muted">
            <span class="font-medium text-ink">Your role:</span>{" "}
            {item.ownerContribution}
          </p>
        </Show>
        <Show when={item.resultTeaser}>
          <p class="mb-3 text-sm text-ink">{item.resultTeaser}</p>
        </Show>
        <Show when={item.tags && item.tags.length > 0}>
          <ul class="mb-4 flex flex-wrap gap-2" role="list">
            <For each={item.tags}>
              {(tag) => (
                <li>
                  <span
                    class="rounded bg-surface-container px-2.5 py-1 font-mono text-xs text-primary"
                  >
                    {tag}
                  </span>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
      <div
        class="relative flex items-center justify-between border-t border-surface-container pt-3 text-sm font-medium text-primary"
      >
        <Show
          when={primary()}
          fallback={<span class="font-mono text-xs text-secondary">Case study</span>}
        >
          {(res) => (
            <A
              href={res().url}
              class="font-mono text-xs text-link no-underline hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {res().label} ({PROJECT_RESOURCE_TYPE_LABELS[res().resourceType]})
            </A>
          )}
        </Show>
        <span class="inline-flex items-center gap-1 transition-all group-hover:gap-1.5">
          View
          <ChevronRight class="size-4" aria-hidden="true" />
        </span>
      </div>
    </LandingContentLink>
  );
}
