import { For, Show } from "solid-js";
import type { HomeProjectHighlight } from "~/content";
import LandingContentLink from "./LandingContentLink";
import { ChevronRight } from "~/icons";

export type ProjectCardAccent = "project" | "research";

export type ProjectCardProps = {
  item: HomeProjectHighlight;
  accent: ProjectCardAccent;
};

function ProjectCardImage(props: { image: NonNullable<HomeProjectHighlight["image"]> }) {
  const alt = props.image.alt.trim();
  if (!alt) return null;

  return (
    <div class="aspect-[16/10] w-full overflow-hidden bg-surface-muted">
      <img
        src={props.image.src}
        alt={alt}
        loading="lazy"
        decoding="async"
        class="size-full object-cover"
      />
    </div>
  );
}

export default function ProjectCard(props: ProjectCardProps) {
  const { item } = props;

  return (
    <LandingContentLink
      href={item.href}
      ariaLabel={`View project: ${item.title}`}
      class="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md no-underline"
    >
      <div
        class="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-primary/5 transition-transform group-hover:scale-110"
        aria-hidden="true"
      />
      <Show when={item.image}>
        <ProjectCardImage image={item.image!} />
      </Show>
      <div class="relative">
        <h3 class="siam-headline-md mb-2 font-medium text-brand-deep">{item.title}</h3>
        <p class="mb-4 text-sm text-on-surface-variant">{item.summary}</p>
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
        <span class="font-mono text-xs text-secondary">Open source</span>
        <span class="inline-flex items-center gap-1 transition-all group-hover:gap-1.5">
          View
          <ChevronRight class="size-4" aria-hidden="true" />
        </span>
      </div>
    </LandingContentLink>
  );
}
