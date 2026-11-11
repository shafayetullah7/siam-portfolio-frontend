import { revalidate } from "@solidjs/router";
import { createSignal, For, onMount, Show } from "solid-js";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import ThemeProjectsEditor from "~/components/admin/research/ThemeProjectsEditor";
import ThemePublicationsEditor from "~/components/admin/research/ThemePublicationsEditor";
import { adminProjectsApi } from "~/lib/api/endpoints/admin/projects.api";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { adminTalksApi } from "~/lib/api/endpoints/admin/talks.api";
import type { ResearchThemeAdmin } from "~/lib/api/types/admin.types";
import type {
  ResearchThemeProjectLink,
  ResearchThemePublicationLink,
} from "~/lib/api/types/research.types";
import type { TalkRelationsAdmin } from "~/lib/api/types/talks.types";
import { getApiErrorMessage } from "~/lib/api/errors";
import {
  getPublicResearchTheme,
  getPublicResearchThemes,
  getPublicTalkBySlug,
  getPublicTalks,
} from "~/lib/api/queries/public";

export type TalkRelationsPanelProps = {
  talkId: string;
  slug: string;
  relations: TalkRelationsAdmin;
  onSaved?: (relations: TalkRelationsAdmin) => void;
};

type ThemeLink = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishStatus: ResearchThemeProjectLink["publishStatus"];
  sortOrder: number;
};

function orderByIds<T extends { id: string }>(
  ids: string[],
  rows: T[],
): T[] {
  const byId = new Map(rows.map((row) => [row.id, row]));
  return ids.map((id) => byId.get(id)).filter((row): row is T => row != null);
}

export default function TalkRelationsPanel(props: TalkRelationsPanelProps) {
  const [publications, setPublications] = createSignal<
    ResearchThemePublicationLink[]
  >([]);
  const [projects, setProjects] = createSignal<ResearchThemeProjectLink[]>([]);
  const [themes, setThemes] = createSignal<ThemeLink[]>([]);
  const [dirty, setDirty] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const rel = props.relations;
    try {
      const [pubRows, projectRows, themeRows] = await Promise.all([
        rel.publicationIds.length
          ? adminPublicationsApi.list({ limit: 100 })
          : Promise.resolve([]),
        rel.projectIds.length
          ? adminProjectsApi.list({ limit: 100 })
          : Promise.resolve([]),
        rel.themeIds.length
          ? adminResearchApi.list()
          : Promise.resolve([]),
      ]);

      setPublications(
        orderByIds(rel.publicationIds, pubRows).map((row, index) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          authorsShort: row.authorsShort,
          year: row.year,
          venue: row.venue,
          publishStatus: row.publishStatus,
          sortOrder: index,
        })),
      );
      setProjects(
        orderByIds(rel.projectIds, projectRows).map((row, index) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          summary: row.summary,
          tags: row.tags,
          publishStatus: row.publishStatus,
          sortOrder: index,
        })),
      );
      setThemes(
        orderByIds(rel.themeIds, themeRows as ResearchThemeAdmin[]).map(
          (row, index) => ({
            id: row.id,
            slug: row.slug,
            title: row.title,
            summary: row.summary,
            publishStatus: row.publishStatus,
            sortOrder: index,
          }),
        ),
      );
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    }
  });

  function revalidatePublicCaches(themeSlugs: string[]) {
    revalidate(getPublicTalks.key);
    revalidate(getPublicTalkBySlug.keyFor(props.slug));
    revalidate(getPublicResearchThemes.key);
    for (const slug of themeSlugs) {
      revalidate(getPublicResearchTheme.keyFor(slug));
    }
  }

  async function save() {
    setPending(true);
    setMessage(null);
    try {
      const themeSlugs = themes().map((t) => t.slug);
      const saved = await adminTalksApi.putRelations(props.talkId, {
        publicationIds: publications().map((row) => row.id),
        projectIds: projects().map((row) => row.id),
        themeIds: themes().map((row) => row.id),
      });
      setDirty(false);
      setMessage("Saved.");
      revalidatePublicCaches(themeSlugs);
      props.onSaved?.(saved.relations);
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <section class="rounded-lg border border-border p-4">
      <h2 class="text-lg font-semibold text-ink">Related outputs</h2>
      <p class="mt-1 text-sm text-ink-muted">
        Linked publications, projects, and research themes appear on the public
        talk detail and on theme pages when targets are published.
      </p>
      <Show when={loadError()}>
        <p class="mt-2 text-sm text-error">{loadError()}</p>
      </Show>

      <div class="mt-6 space-y-8">
        <div>
          <h3 class="text-sm font-medium text-ink">Publications</h3>
          <div class="mt-2">
            <ThemePublicationsEditor
              publishedOnly
              links={publications()}
              onChange={setPublications}
              onDirty={() => setDirty(true)}
            />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ink">Projects</h3>
          <div class="mt-2">
            <ThemeProjectsEditor
              links={projects()}
              onChange={setProjects}
              onDirty={() => setDirty(true)}
            />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ink">Research themes</h3>
          <ThemeResearchPicker
            links={themes()}
            onChange={setThemes}
            onDirty={() => setDirty(true)}
          />
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-2">
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
          {pending() ? "Saving…" : "Save relations"}
        </button>
      </div>
    </section>
  );
}

function ThemeResearchPicker(props: {
  links: ThemeLink[];
  onChange: (links: ThemeLink[]) => void;
  onDirty: () => void;
}) {
  const linkedIds = () => new Set(props.links.map((l) => l.id));

  function addTheme(theme: ResearchThemeAdmin) {
    if (linkedIds().has(theme.id) || props.links.length >= 20) return;
    props.onChange([
      ...props.links,
      {
        id: theme.id,
        slug: theme.slug,
        title: theme.title,
        summary: theme.summary,
        publishStatus: theme.publishStatus,
        sortOrder: props.links.length,
      },
    ]);
    props.onDirty();
  }

  return (
    <div class="space-y-2">
      <For each={props.links}>
        {(link, index) => (
          <div class="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
            <span class="font-medium text-ink">{link.title}</span>
            <button
              type="button"
              class="siam-btn-secondary text-sm"
              onClick={() => {
                const rows = props.links.filter((_, i) => i !== index());
                props.onChange(rows.map((row, i) => ({ ...row, sortOrder: i })));
                props.onDirty();
              }}
            >
              Remove
            </button>
          </div>
        )}
      </For>
      <ThemeSearchButton onPick={addTheme} linkedIds={linkedIds()} />
    </div>
  );
}

function ThemeSearchButton(props: {
  linkedIds: Set<string>;
  onPick: (theme: ResearchThemeAdmin) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<ResearchThemeAdmin[]>([]);

  async function search() {
    const rows = await adminResearchApi.list(
      query().trim() ? { q: query().trim() } : undefined,
    );
    setResults(
      rows.filter(
        (row) =>
          row.publishStatus === "published" && !props.linkedIds.has(row.id),
      ),
    );
  }

  return (
    <>
      <button
        type="button"
        class="siam-btn-secondary text-sm"
        onClick={() => {
          setOpen(true);
          void search();
        }}
      >
        Add theme
      </button>
      <Show when={open()}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div class="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl bg-surface-container-lowest p-4">
            <input
              class="siam-input mb-2 w-full"
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
            />
            <button
              type="button"
              class="siam-btn-primary mb-2"
              onClick={() => void search()}
            >
              Search
            </button>
            <ul class="list-none space-y-2 p-0">
              <For each={results()}>
                {(theme) => (
                  <li>
                    <button
                      type="button"
                      class="w-full rounded border border-border p-2 text-left"
                      onClick={() => {
                        props.onPick(theme);
                        setOpen(false);
                      }}
                    >
                      {theme.title}
                      <PublishStatusBadge status={theme.publishStatus} />
                    </button>
                  </li>
                )}
              </For>
            </ul>
            <button
              type="button"
              class="siam-btn-secondary mt-2"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}
