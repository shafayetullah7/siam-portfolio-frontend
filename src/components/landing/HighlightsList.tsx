import { For, Show } from "solid-js";
import type { HomeHighlight } from "~/content";
import LandingContentLink from "./LandingContentLink";

export type HighlightsListProps = {
  items: readonly HomeHighlight[];
};

function HighlightItem(props: { highlight: HomeHighlight }) {
  const { highlight } = props;

  return (
    <li class="text-ink-muted">
      <span>{highlight.text}</span>
      <Show when={highlight.sourceUrl?.trim()}>
        <span class="text-ink-subtle">
          {" "}
          (
          <LandingContentLink
            href={highlight.sourceUrl!}
            class="text-link no-underline hover:underline"
          >
            Source
          </LandingContentLink>
          <Show when={highlight.asOfDate?.trim()}>
            <span class="text-xs"> — as of {highlight.asOfDate}</span>
          </Show>
          )
        </span>
      </Show>
    </li>
  );
}

export default function HighlightsList(props: HighlightsListProps) {
  return (
    <ul class="list-disc space-y-2 pl-5">
      <For each={props.items}>{(highlight) => <HighlightItem highlight={highlight} />}</For>
    </ul>
  );
}
