import { For, Show } from "solid-js";
import type { TimelinePublicImage } from "~/lib/api/types/timeline.types";

export type AchievementGalleryProps = {
  images: TimelinePublicImage[];
};

export default function AchievementGallery(props: AchievementGalleryProps) {
  const sorted = () =>
    [...props.images].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <Show when={sorted().length > 0}>
      <ul class="mt-8 grid list-none gap-4 pl-0 sm:grid-cols-2">
        <For each={sorted()}>
          {(img) => (
            <li class="overflow-hidden rounded-lg border border-border">
              <img
                src={img.url}
                alt={img.alt}
                class="aspect-video w-full object-cover"
              />
              <Show when={img.caption}>
                <p class="p-3 text-sm text-ink-muted">{img.caption}</p>
              </Show>
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
}
