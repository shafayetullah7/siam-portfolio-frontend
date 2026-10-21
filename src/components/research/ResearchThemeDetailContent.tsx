import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import type { ResearchThemeDetailPublic } from "~/lib/api/types/research.types";

export type ResearchThemeDetailContentProps = {
  theme: ResearchThemeDetailPublic;
};

function Section(props: { title: string; body: string }) {
  return (
    <>
      <h2 class="siam-headline-md mt-8 text-brand-deep">{props.title}</h2>
      <p>{props.body}</p>
    </>
  );
}

export default function ResearchThemeDetailContent(
  props: ResearchThemeDetailContentProps,
) {
  const theme = () => props.theme;
  return (
    <>
      <Show when={theme().cover}>
        {(cover) => (
          <img
            src={cover().url}
            alt={cover().alt ?? ""}
            class="mt-6 max-h-80 w-full rounded-lg object-cover"
          />
        )}
      </Show>
      <p class="text-lg text-secondary">{theme().summary}</p>
      <Show when={theme().problem}>
        {(text) => <Section title="Problem" body={text()} />}
      </Show>
      <Show when={theme().significance}>
        {(text) => <Section title="Significance" body={text()} />}
      </Show>
      <Show when={theme().objectives}>
        {(text) => <Section title="Objectives" body={text()} />}
      </Show>
      <Show when={theme().approach}>
        {(text) => <Section title="Approach" body={text()} />}
      </Show>
      <Show when={theme().findings}>
        {(text) => <Section title="Findings" body={text()} />}
      </Show>
      <Show when={theme().limitations}>
        {(text) => <Section title="Limitations" body={text()} />}
      </Show>
      <Show when={theme().futureWork}>
        {(text) => <Section title="Future work" body={text()} />}
      </Show>
      <Show when={theme().collaborators && theme().collaborators!.length > 0}>
        <h2 class="siam-headline-md mt-8 text-brand-deep">Collaborators</h2>
        <ul class="list-disc pl-5">
          <For each={theme().collaborators!}>
            {(person) => (
              <li>
                {person.url ? (
                  <a href={person.url} class="text-link" rel="noopener noreferrer">
                    {person.name}
                  </a>
                ) : (
                  person.name
                )}
                {person.role ? ` — ${person.role}` : ""}
              </li>
            )}
          </For>
        </ul>
      </Show>
      <Show when={theme().acknowledgments}>
        {(text) => <Section title="Acknowledgments" body={text()} />}
      </Show>
      <Show when={theme().funding}>
        {(text) => <Section title="Funding" body={text()} />}
      </Show>
      <Show
        when={
          theme().related?.publications &&
          theme().related!.publications.length > 0
        }
      >
        <h2 class="siam-headline-md mt-8 text-brand-deep">
          Related publications
        </h2>
        <ul class="list-none space-y-4 pl-0">
          <For each={theme().related!.publications}>
            {(pub) => (
              <li class="rounded-lg border border-border p-4">
                <A href={pub.href} class="text-link font-medium no-underline">
                  {pub.title}
                </A>
                <p class="mt-1 text-sm text-ink-muted">
                  {pub.authorsShort} · {pub.venue} ({pub.year})
                </p>
                <Show when={pub.significance}>
                  <p class="mt-2 text-sm text-on-surface-variant">
                    {pub.significance}
                  </p>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <Show
        when={
          theme().related?.projects && theme().related!.projects.length > 0
        }
      >
        <h2 class="siam-headline-md mt-8 text-brand-deep">Related projects</h2>
        <ul class="list-none space-y-4 pl-0">
          <For each={theme().related!.projects}>
            {(project) => (
              <li class="rounded-lg border border-border p-4">
                <A href={project.href} class="text-link font-medium no-underline">
                  {project.title}
                </A>
                <p class="mt-2 text-sm text-on-surface-variant">
                  {project.summary}
                </p>
                <Show when={project.tags && project.tags!.length > 0}>
                  <p class="mt-2 text-sm text-ink-muted">
                    {project.tags!.join(" · ")}
                  </p>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <Show when={theme().resources && theme().resources!.length > 0}>
        <h2 class="siam-headline-md mt-8 text-brand-deep">Resources</h2>
        <ul class="list-none space-y-2 pl-0">
          <For each={theme().resources!}>
            {(resource) => (
              <li>
                <a
                  href={resource.url}
                  class="text-link"
                  rel="noopener noreferrer"
                >
                  {resource.label}
                </a>
                <span class="ml-2 text-sm text-ink-muted">
                  ({resource.resourceType})
                </span>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  );
}
