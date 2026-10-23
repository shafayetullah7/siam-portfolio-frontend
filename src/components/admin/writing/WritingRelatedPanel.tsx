import { createSignal, For, onMount, Show } from "solid-js";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import ThemeProjectsEditor from "~/components/admin/research/ThemeProjectsEditor";
import ThemePublicationsEditor from "~/components/admin/research/ThemePublicationsEditor";
import { adminProjectsApi } from "~/lib/api/endpoints/admin/projects.api";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { adminWritingApi } from "~/lib/api/endpoints/admin/writing.api";
import type { ResearchThemeAdmin } from "~/lib/api/types/admin.types";
import type {
  ResearchThemeProjectLink,
  ResearchThemePublicationLink,
} from "~/lib/api/types/research.types";
import type { WritingAdminSummary } from "~/lib/api/types/writing.types";
import { getApiErrorMessage } from "~/lib/api/errors";

export type WritingRelatedPanelProps = {
  articleId: string;
  excludeArticleId: string;
};

type ThemeLink = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishStatus: ResearchThemeProjectLink["publishStatus"];
  sortOrder: number;
};

type ArticleLink = {
  id: string;
  slug: string;
  title: string;
  publishStatus: WritingAdminSummary["publishStatus"];
  sortOrder: number;
};

function orderByIds<T extends { id: string }>(
  ids: string[],
  rows: T[],
): T[] {
  const byId = new Map(rows.map((row) => [row.id, row]));
  return ids.map((id) => byId.get(id)).filter((row): row is T => row != null);
}

export default function WritingRelatedPanel(props: WritingRelatedPanelProps) {
  const [publications, setPublications] = createSignal<
    ResearchThemePublicationLink[]
  >([]);
  const [projects, setProjects] = createSignal<ResearchThemeProjectLink[]>([]);
  const [themes, setThemes] = createSignal<ThemeLink[]>([]);
  const [articles, setArticles] = createSignal<ArticleLink[]>([]);
  const [dirty, setDirty] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const rel = await adminWritingApi.getRelations(props.articleId);
      const [pubRows, projectRows, themeRows, articleRows] = await Promise.all([
        rel.publicationIds.length
          ? adminPublicationsApi.list({ limit: 100 })
          : Promise.resolve([]),
        rel.projectIds.length
          ? adminProjectsApi.list({ limit: 100 })
          : Promise.resolve([]),
        rel.themeIds.length
          ? adminResearchApi.list()
          : Promise.resolve([]),
        rel.relatedArticleIds.length
          ? adminWritingApi.list({ limit: 100 })
          : Promise.resolve({ items: [], meta: { page: 1, limit: 100, total: 0 } }),
      ]);

      const orderedPubs = orderByIds(rel.publicationIds, pubRows).map(
        (row, index) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          authorsShort: row.authorsShort,
          year: row.year,
          venue: row.venue,
          publishStatus: row.publishStatus,
          sortOrder: index,
        }),
      );
      const orderedProjects = orderByIds(rel.projectIds, projectRows).map(
        (row, index) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          summary: row.summary,
          tags: row.tags,
          publishStatus: row.publishStatus,
          sortOrder: index,
        }),
      );
      const orderedThemes = orderByIds(
        rel.themeIds,
        themeRows as ResearchThemeAdmin[],
      ).map((row, index) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        publishStatus: row.publishStatus,
        sortOrder: index,
      }));
      const orderedArticles = orderByIds(
        rel.relatedArticleIds,
        articleRows.items,
      ).map((row, index) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        publishStatus: row.publishStatus,
        sortOrder: index,
      }));

      setPublications(orderedPubs);
      setProjects(orderedProjects);
      setThemes(orderedThemes);
      setArticles(orderedArticles);
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    }
  });

  async function save() {
    setPending(true);
    setMessage(null);
    try {
      await adminWritingApi.putRelations(props.articleId, {
        publicationIds: publications().map((row) => row.id),
        projectIds: projects().map((row) => row.id),
        themeIds: themes().map((row) => row.id),
        relatedArticleIds: articles().map((row) => row.id),
      });
      setDirty(false);
      setMessage("Saved.");
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <section class="mt-10 space-y-8 rounded-xl border border-border bg-surface-container-lowest p-4 shadow-sm">
      <div>
        <h2 class="text-lg font-semibold text-ink">Related content</h2>
        <p class="mt-1 text-sm text-ink-muted">
          Links shown on the public article when targets are published. Order
          matches the lists below.
        </p>
        <Show when={loadError()}>
          <p class="mt-2 text-sm text-error">{loadError()}</p>
        </Show>
      </div>

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

      <div>
        <h3 class="text-sm font-medium text-ink">Related articles</h3>
        <RelatedArticlesPicker
          articleId={props.excludeArticleId}
          links={articles()}
          onChange={setArticles}
          onDirty={() => setDirty(true)}
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
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

  async function addTheme(theme: ResearchThemeAdmin) {
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

function RelatedArticlesPicker(props: {
  articleId: string;
  links: ArticleLink[];
  onChange: (links: ArticleLink[]) => void;
  onDirty: () => void;
}) {
  const linkedIds = () => new Set(props.links.map((l) => l.id));

  async function addArticle(row: WritingAdminSummary) {
    if (
      row.id === props.articleId ||
      linkedIds().has(row.id) ||
      props.links.length >= 20
    ) {
      return;
    }
    props.onChange([
      ...props.links,
      {
        id: row.id,
        slug: row.slug,
        title: row.title,
        publishStatus: row.publishStatus,
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
      <ArticleSearchButton
        excludeId={props.articleId}
        linkedIds={linkedIds()}
        onPick={addArticle}
      />
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
            <button type="button" class="siam-btn-primary mb-2" onClick={() => void search()}>
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
                    </button>
                  </li>
                )}
              </For>
            </ul>
            <button type="button" class="siam-btn-secondary mt-2" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}

function ArticleSearchButton(props: {
  excludeId: string;
  linkedIds: Set<string>;
  onPick: (row: WritingAdminSummary) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<WritingAdminSummary[]>([]);

  async function search() {
    const res = await adminWritingApi.list(
      query().trim() ? { q: query().trim(), limit: 25 } : { limit: 25 },
    );
    setResults(
      res.items.filter(
        (row) =>
          row.id !== props.excludeId &&
          !props.linkedIds.has(row.id) &&
          row.publishStatus === "published",
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
        Add article
      </button>
      <Show when={open()}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div class="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl bg-surface-container-lowest p-4">
            <input
              class="siam-input mb-2 w-full"
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
            />
            <button type="button" class="siam-btn-primary mb-2" onClick={() => void search()}>
              Search
            </button>
            <ul class="list-none space-y-2 p-0">
              <For each={results()}>
                {(row) => (
                  <li>
                    <button
                      type="button"
                      class="w-full rounded border border-border p-2 text-left"
                      onClick={() => {
                        props.onPick(row);
                        setOpen(false);
                      }}
                    >
                      <span class="font-medium">{row.title}</span>
                      <PublishStatusBadge status={row.publishStatus} />
                    </button>
                  </li>
                )}
              </For>
            </ul>
            <button type="button" class="siam-btn-secondary mt-2" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}
