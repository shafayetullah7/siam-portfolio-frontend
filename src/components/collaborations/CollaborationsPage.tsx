import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import type { CollaborationsPagePublic } from "~/lib/api/types/talks.types";
import { COLLABORATIONS_PAGE_DISCLAIMER } from "~/lib/talks/collaborations-disclaimer";
import AcademicServiceRow from "./AcademicServiceRow";
import CollaborationCard from "./CollaborationCard";

export type CollaborationsPageProps = {
  data: CollaborationsPagePublic;
};

export default function CollaborationsPage(props: CollaborationsPageProps) {
  const data = () => props.data;

  return (
    <div class="flex flex-col gap-10">
      <Show when={data().collaborations.length > 0}>
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-ink">Collaborations</h2>
          <div class="grid gap-6">
            <For each={data().collaborations}>
              {(item) => <CollaborationCard item={item} />}
            </For>
          </div>
        </section>
      </Show>

      <Show when={data().service.length > 0}>
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-ink">Academic service</h2>
          <ul class="list-none space-y-4 p-0" role="list">
            <For each={data().service}>
              {(row) => (
                <li>
                  <AcademicServiceRow row={row} />
                </li>
              )}
            </For>
          </ul>
        </section>
      </Show>

      <p class="text-sm text-ink-muted">{COLLABORATIONS_PAGE_DISCLAIMER}</p>

      <p>
        <A
          href="/contact"
          class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary no-underline hover:opacity-90"
        >
          Get in touch
        </A>
      </p>
    </div>
  );
}
