import { Show } from "solid-js";
import type { AboutPageViewModel } from "~/lib/api/public/mapPublicAboutToViewModel";

export type AboutIntroSectionProps = {
  model: AboutPageViewModel;
};

export default function AboutIntroSection(props: AboutIntroSectionProps) {
  return (
    <header>
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
        {props.model.title}
      </h1>
      <Show when={props.model.professionalTitle}>
        <p class="mt-2 text-lg text-ink-muted">{props.model.professionalTitle}</p>
      </Show>
      <Show when={props.model.shortBio}>
        <p class="siam-prose mt-4 text-ink-muted">{props.model.shortBio}</p>
      </Show>
      <Show when={props.model.longBio && props.model.longBio !== props.model.shortBio}>
        <p class="siam-prose mt-4 text-ink-muted">{props.model.longBio}</p>
      </Show>
    </header>
  );
}
