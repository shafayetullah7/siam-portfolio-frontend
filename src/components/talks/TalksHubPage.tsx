import { For, Show } from "solid-js";
import type { TalkPublicCard } from "~/lib/api/types/talks.types";
import TalkCard from "./TalkCard";

export type TalksHubPageProps = {
  upcoming: TalkPublicCard[];
  past: TalkPublicCard[];
};

function TalkSection(props: { title: string; items: TalkPublicCard[] }) {
  return (
    <Show when={props.items.length > 0}>
      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-ink">{props.title}</h2>
        <ul class="grid list-none gap-6 p-0 sm:grid-cols-2" role="list">
          <For each={props.items}>
            {(talk) => (
              <li class="min-h-0">
                <TalkCard talk={talk} />
              </li>
            )}
          </For>
        </ul>
      </section>
    </Show>
  );
}

export default function TalksHubPage(props: TalksHubPageProps) {
  return (
    <div class="flex flex-col gap-10">
      <TalkSection title="Upcoming" items={props.upcoming} />
      <TalkSection title="Past" items={props.past} />
    </div>
  );
}
