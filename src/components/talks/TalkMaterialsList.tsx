import { For, Show } from "solid-js";
import type { TalkPublicResource } from "~/lib/api/types/talks.types";
import { TALK_RESOURCE_TYPE_LABELS } from "~/lib/talks/talkLabels";

export type TalkMaterialsListProps = {
  resources: TalkPublicResource[];
};

export default function TalkMaterialsList(props: TalkMaterialsListProps) {
  const items = () => props.resources ?? [];

  return (
    <Show when={items().length > 0}>
      <section class="mt-10">
        <h2 class="text-lg font-semibold text-ink">Materials</h2>
        <ul class="mt-3 list-none space-y-2 p-0">
          <For each={items()}>
            {(resource) => (
              <li>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium text-link no-underline hover:underline"
                >
                  {resource.label}
                </a>
                <span class="ml-2 text-sm text-ink-muted">
                  ({TALK_RESOURCE_TYPE_LABELS[resource.resourceType]})
                </span>
              </li>
            )}
          </For>
        </ul>
      </section>
    </Show>
  );
}
