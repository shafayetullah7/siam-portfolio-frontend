import { A, useNavigate } from "@solidjs/router";
import { createMemo, createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublicationImportPreviewTable from "~/components/admin/publications/PublicationImportPreviewTable";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import type {
  PublicationImportMergeField,
  PublicationImportPreview,
  PublicationImportSource,
} from "~/lib/api/types/publication.types";

const MERGE_FIELD_LABELS: Record<PublicationImportMergeField, string> = {
  title: "Title",
  authors: "Authors",
  year: "Year",
  venue: "Venue",
  abstract: "Abstract",
  significance: "Significance",
  publicationType: "Publication type",
  peerReviewed: "Peer reviewed",
  doi: "DOI",
  publisherUrl: "Publisher URL",
  seoTitle: "SEO title",
  seoDescription: "SEO description",
};

const MERGE_FIELDS: PublicationImportMergeField[] = [
  "title",
  "authors",
  "year",
  "venue",
  "abstract",
  "significance",
  "publicationType",
  "peerReviewed",
  "doi",
  "publisherUrl",
  "seoTitle",
  "seoDescription",
];

type Step = "source" | "preview";

function fieldHasContent(
  field: PublicationImportMergeField,
  existing: Awaited<ReturnType<typeof adminPublicationsApi.get>> | undefined,
): boolean {
  if (!existing) return false;
  switch (field) {
    case "title":
      return existing.title.trim().length > 0;
    case "authors":
      return existing.authors.length > 0;
    case "year":
      return true;
    case "venue":
      return existing.venue.trim().length > 0;
    case "abstract":
      return (existing.abstract?.trim() ?? "").length > 0;
    case "significance":
      return (existing.significance?.trim() ?? "").length > 0;
    case "publicationType":
      return existing.publicationType !== "other";
    case "peerReviewed":
      return existing.peerReviewed;
    case "doi":
      return (existing.doi?.trim() ?? "").length > 0;
    case "publisherUrl":
      return (existing.publisherUrl?.trim() ?? "").length > 0;
    case "seoTitle":
      return (existing.seoTitle?.trim() ?? "").length > 0;
    case "seoDescription":
      return (existing.seoDescription?.trim() ?? "").length > 0;
    default:
      return false;
  }
}

export default function PublicationImportWizard() {
  const navigate = useNavigate();
  const [step, setStep] = createSignal<Step>("source");
  const [source, setSource] = createSignal<PublicationImportSource>("bibtex");
  const [bibtex, setBibtex] = createSignal("");
  const [doi, setDoi] = createSignal("");
  const [preview, setPreview] = createSignal<PublicationImportPreview | null>(
    null,
  );
  const [previewError, setPreviewError] = createSignal<string | null>(null);
  const [previewLoading, setPreviewLoading] = createSignal(false);
  const [confirmLoading, setConfirmLoading] = createSignal(false);
  const [confirmError, setConfirmError] = createSignal<string | null>(null);
  const [action, setAction] = createSignal<"create" | "merge">("create");
  const [mergePublicationId, setMergePublicationId] = createSignal<
    string | null
  >(null);
  const [mergeFields, setMergeFields] = createSignal<
    Set<PublicationImportMergeField>
  >(new Set());

  const mergeTarget = createResource(
    () => mergePublicationId(),
    (id) => (id ? adminPublicationsApi.get(id) : Promise.resolve(undefined)),
  );

  const sourcePayload = createMemo(() => {
    const s = source();
    if (s === "bibtex") {
      return { source: s, bibtex: bibtex() };
    }
    return { source: s, doi: doi() };
  });

  async function runPreview() {
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      const result = await adminPublicationsApi.importPreview(sourcePayload());
      setPreview(result);
      setAction(result.duplicates.length > 0 ? "merge" : "create");
      setMergePublicationId(result.duplicates[0]?.id ?? null);
      setMergeFields(new Set());
      setStep("preview");
    } catch (err) {
      setPreviewError(
        err instanceof Error ? err.message : "Preview failed. Try again.",
      );
    } finally {
      setPreviewLoading(false);
    }
  }

  function toggleMergeField(field: PublicationImportMergeField) {
    setMergeFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  }

  async function runConfirm() {
    const p = preview();
    if (!p) return;
    setConfirmError(null);
    setConfirmLoading(true);
    try {
      const body = {
        ...sourcePayload(),
        action: action(),
        ...(action() === "merge" && mergePublicationId()
          ? {
              mergePublicationId: mergePublicationId()!,
              mergeFields: [...mergeFields()],
            }
          : {}),
      };
      const created = await adminPublicationsApi.importConfirm(body);
      navigate(`/admin/publications/${created.id}/edit`);
    } catch (err) {
      setConfirmError(
        err instanceof Error ? err.message : "Import failed. Try again.",
      );
    } finally {
      setConfirmLoading(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Import publication"
        description="Import from BibTeX or DOI. New records are saved as drafts."
      >
        <A href="/admin/publications" class="siam-btn-secondary no-underline">
          Back to list
        </A>
      </AdminPageHeader>

      <p class="mt-4 max-w-2xl text-sm text-ink-muted">
        Imports always create or update <strong>drafts</strong>. Existing fields
        are not replaced on merge unless you select them below.
      </p>

      <Show when={step() === "source"}>
        <div class="mt-8 max-w-2xl space-y-6">
          <fieldset class="space-y-2">
            <legend class="text-sm font-medium text-ink">Source</legend>
            <label class="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="import-source"
                checked={source() === "bibtex"}
                onChange={() => setSource("bibtex")}
              />
              BibTeX paste
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="import-source"
                checked={source() === "doi"}
                onChange={() => setSource("doi")}
              />
              DOI lookup
            </label>
          </fieldset>

          <Show when={source() === "bibtex"}>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">BibTeX entry</span>
              <textarea
                class="siam-input min-h-[10rem] font-mono text-xs"
                value={bibtex()}
                onInput={(e) => setBibtex(e.currentTarget.value)}
                placeholder="@article{...}"
              />
            </label>
          </Show>

          <Show when={source() === "doi"}>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">DOI</span>
              <input
                type="text"
                class="siam-input"
                value={doi()}
                onInput={(e) => setDoi(e.currentTarget.value)}
                placeholder="10.0000/example"
              />
            </label>
          </Show>

          <Show when={previewError()}>
            <p class="text-sm text-error" role="alert">{previewError()}</p>
          </Show>

          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="siam-btn-primary"
              disabled={previewLoading()}
              onClick={() => void runPreview()}
            >
              {previewLoading() ? "Loading…" : "Preview import"}
            </button>
            <A
              href="/admin/publications/new"
              class="siam-btn-secondary no-underline"
            >
              Enter manually
            </A>
          </div>
        </div>
      </Show>

      <Show when={step() === "preview" && preview()}>
        {(p) => (
          <div class="mt-8 max-w-3xl space-y-6">
            <Show when={p().parseWarnings.length > 0}>
              <div
                class="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm"
                role="status"
              >
                <p class="font-medium text-ink">Parse warnings</p>
                <ul class="mt-1 list-disc pl-5 text-ink-muted">
                  <For each={p().parseWarnings}>
                    {(w) => <li>{w}</li>}
                  </For>
                </ul>
              </div>
            </Show>

            <section>
              <h2 class="text-lg font-medium text-ink">Proposed fields</h2>
              <div class="mt-2 rounded-md border border-border p-4">
                <PublicationImportPreviewTable proposed={p().proposed} />
              </div>
            </section>

            <Show when={p().duplicates.length > 0}>
              <section>
                <h2 class="text-lg font-medium text-ink">Possible duplicates</h2>
                <table class="mt-2 w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-border text-ink-muted">
                      <th class="py-2 pr-4">Title</th>
                      <th class="py-2 pr-4">Year</th>
                      <th class="py-2 pr-4">Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={p().duplicates}>
                      {(dup) => (
                        <tr class="border-b border-border">
                          <td class="py-2 pr-4">
                            <A
                              href={`/admin/publications/${dup.id}`}
                              class="text-primary underline"
                            >
                              {dup.title}
                            </A>
                          </td>
                          <td class="py-2 pr-4">{dup.year}</td>
                          <td class="py-2 pr-4">{dup.matchReason}</td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>

                <fieldset class="mt-4 space-y-2">
                  <legend class="text-sm font-medium text-ink">
                    Import action
                  </legend>
                  <label class="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="import-action"
                      checked={action() === "create"}
                      onChange={() => setAction("create")}
                    />
                    Create new draft (blocked if DOI already exists)
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="import-action"
                      checked={action() === "merge"}
                      onChange={() => setAction("merge")}
                    />
                    Merge into existing record
                  </label>
                </fieldset>

                <Show when={action() === "merge"}>
                  <label class="mt-3 flex flex-col gap-1 text-sm">
                    <span class="text-ink-muted">Merge target</span>
                    <select
                      class="siam-input max-w-md"
                      value={mergePublicationId() ?? ""}
                      onChange={(e) => {
                        setMergePublicationId(e.currentTarget.value);
                        setMergeFields(new Set());
                      }}
                    >
                      <For each={p().duplicates}>
                        {(dup) => (
                          <option value={dup.id}>{dup.title}</option>
                        )}
                      </For>
                    </select>
                  </label>
                </Show>
              </section>
            </Show>

            <Show when={action() === "merge" && mergePublicationId()}>
              <section>
                <h2 class="text-lg font-medium text-ink">Merge fields</h2>
                <p class="mt-1 text-sm text-ink-muted">
                  Check fields to replace with imported values. Empty fields on
                  the existing record may still be filled automatically.
                </p>
                <div class="mt-3 grid gap-2 sm:grid-cols-2">
                  <For each={MERGE_FIELDS}>
                    {(field) => {
                      const existing = mergeTarget[0]();
                      const hasContent = () =>
                        fieldHasContent(field, existing);
                      return (
                        <label class="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={mergeFields().has(field)}
                            onChange={() => toggleMergeField(field)}
                          />
                          <span>
                            {MERGE_FIELD_LABELS[field]}
                            <Show when={hasContent()}>
                              <span class="text-ink-muted">
                                {" "}
                                (has content)
                              </span>
                            </Show>
                          </span>
                        </label>
                      );
                    }}
                  </For>
                </div>
              </section>
            </Show>

            <Show when={confirmError()}>
              <p class="text-sm text-error" role="alert">{confirmError()}</p>
            </Show>

            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                class="siam-btn-secondary"
                onClick={() => setStep("source")}
              >
                Back
              </button>
              <button
                type="button"
                class="siam-btn-primary"
                disabled={confirmLoading()}
                onClick={() => void runConfirm()}
              >
                {confirmLoading() ? "Saving…" : "Confirm import"}
              </button>
            </div>
          </div>
        )}
      </Show>

    </div>
  );
}
