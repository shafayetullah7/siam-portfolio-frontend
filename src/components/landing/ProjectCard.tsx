import { For, Show } from "solid-js";
import type { HomeProjectHighlight } from "~/content";
import LandingContentLink from "./LandingContentLink";

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
  const accentClass = () =>
    props.accent === "project" ? "bg-accent-project" : "bg-accent-research";

  return (
    <LandingContentLink
      href={item.href}
      ariaLabel={`View project: ${item.title}`}
      class="siam-card siam-card-interactive block h-full overflow-hidden no-underline"
    >
      <div class={`h-1.5 ${accentClass()}`} aria-hidden="true" />
      <Show when={item.image}>
        <ProjectCardImage image={item.image!} />
      </Show>
      <div class="p-5">
        <h3 class="font-semibold text-ink">{item.title}</h3>
        <p class="mt-2 text-sm text-ink-muted">{item.summary}</p>
        <Show when={item.tags && item.tags.length > 0}>
          <ul class="mt-4 flex flex-wrap gap-2" role="list">
            <For each={item.tags}>
              {(tag) => (
                <li>
                  <span class="siam-chip">{tag}</span>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </LandingContentLink>
  );
}
