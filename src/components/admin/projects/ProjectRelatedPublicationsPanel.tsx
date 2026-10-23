import { createSignal, onMount, Show } from "solid-js";
import ThemePublicationsEditor from "~/components/admin/research/ThemePublicationsEditor";
import {
  adminProjectsApi,
  type ProjectPublicationLink,
} from "~/lib/api/endpoints/admin/projects.api";
import type { ResearchThemePublicationLink } from "~/lib/api/types/research.types";
import { getApiErrorMessage } from "~/lib/api/errors";

export type ProjectRelatedPublicationsPanelProps = {
  projectId: string;
};

function toEditorLinks(
  links: ProjectPublicationLink[],
): ResearchThemePublicationLink[] {
  return links.map((link) => ({
    id: link.id,
    slug: link.slug,
    title: link.title,
    authorsShort: link.authorsShort,
    year: link.year,
    venue: link.venue,
    publishStatus: link.publishStatus as ResearchThemePublicationLink["publishStatus"],
    sortOrder: link.sortOrder,
  }));
}

export default function ProjectRelatedPublicationsPanel(
  props: ProjectRelatedPublicationsPanelProps,
) {
  const [links, setLinks] = createSignal<ProjectPublicationLink[]>([]);
  const [dirty, setDirty] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      setLinks(await adminProjectsApi.getPublications(props.projectId));
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    }
  });

  async function save() {
    setPending(true);
    setMessage(null);
    try {
      const saved = await adminProjectsApi.putPublications(
        props.projectId,
        links().map((l) => l.id),
      );
      setLinks(saved);
      setDirty(false);
      setMessage("Saved.");
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <section class="mt-10 rounded-xl border border-border bg-surface-container-lowest p-4 shadow-sm">
      <h2 class="text-lg font-semibold text-ink">Related publications</h2>
      <p class="mt-1 text-sm text-ink-muted">
        Published papers shown on the public project detail. Order matches the
        list below.
      </p>
      <Show when={loadError()}>
        <p class="mt-2 text-sm text-error">{loadError()}</p>
      </Show>
      <div class="mt-4">
        <ThemePublicationsEditor
          publishedOnly
          links={toEditorLinks(links())}
          onChange={(next) => {
            setLinks(
              next.map((row) => ({
                id: row.id,
                slug: row.slug,
                title: row.title,
                authorsShort: row.authorsShort,
                year: row.year,
                venue: row.venue,
                publishStatus: row.publishStatus,
                sortOrder: row.sortOrder,
              })),
            );
          }}
          onDirty={() => setDirty(true)}
        />
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <Show when={message()}>
          <span
            classList={{
              "text-sm": true,
              "text-ink-muted": message() === "Saved.",
              "text-error": message() !== "Saved.",
            }}
          >
            {message()}
          </span>
        </Show>
        <button
          type="button"
          class="siam-btn-primary text-sm"
          disabled={!dirty() || pending()}
          onClick={() => void save()}
        >
          {pending() ? "Saving…" : "Save publications"}
        </button>
      </div>
    </section>
  );
}
