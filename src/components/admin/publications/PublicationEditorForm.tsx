import { A, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import {
  adminPublicationsApi,
  type PublicationAdminSummary,
} from "~/lib/api/endpoints/admin/publications.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import {
  emptyPublicationDraft,
  fieldErrorsFromZod,
  PUBLICATION_TYPES,
  publicationDraftFromAdmin,
  publicationDraftToWriteBody,
  publicationWriteSchema,
  type PublicationWriteInput,
} from "~/lib/forms/schemas/publication-write.schema";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import PublicationAuthorsEditor from "~/components/admin/publications/PublicationAuthorsEditor";
import PublicationPdfSection from "~/components/admin/publications/PublicationPdfSection";
import PublicationSupplementsEditor from "~/components/admin/publications/PublicationSupplementsEditor";
import type { PublicationPdfMediaSummary } from "~/lib/api/types/publication.types";
import { slugFromTitle } from "~/lib/slug/slugFromTitle";

export type PublicationEditorFormProps = {
  mode: "create" | "edit";
  publicationId?: string;
  initial?: PublicationAdminSummary;
  onSaved?: (summary: PublicationAdminSummary) => void;
};

function patchDraft(
  prev: PublicationWriteInput,
  patch: Partial<PublicationWriteInput>,
): PublicationWriteInput {
  return { ...prev, ...patch };
}

export default function PublicationEditorForm(props: PublicationEditorFormProps) {
  const navigate = useNavigate();
  const isEdit = () => props.mode === "edit";

  const [draft, setDraft] = createSignal<PublicationWriteInput>(
    emptyPublicationDraft(),
  );
  const [slugManual, setSlugManual] = createSignal(false);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>(
    {},
  );
  const [formError, setFormError] = createSignal<string | null>(null);
  const [savedMessage, setSavedMessage] = createSignal<string | null>(null);
  const [dirty, setDirty] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [publishStatus, setPublishStatus] = createSignal("draft");
  const [pdfMedia, setPdfMedia] = createSignal<PublicationPdfMediaSummary | null>(
    null,
  );

  useUnsavedChanges(dirty);

  createEffect(() => {
    if (props.initial) {
      setDraft(publicationDraftFromAdmin(props.initial));
      setPublishStatus(props.initial.publishStatus);
      setPdfMedia(props.initial.pdfMedia ?? null);
      setDirty(false);
      setSlugManual(true);
    }
  });

  function markDirty() {
    setDirty(true);
    setSavedMessage(null);
  }

  function updateTitle(value: string) {
    markDirty();
    setDraft((prev) => {
      const patch: Partial<PublicationWriteInput> = { title: value };
      if (!slugManual()) {
        patch.slug = slugFromTitle(value);
      }
      return patchDraft(prev, patch);
    });
  }

  function nullableField(key: keyof PublicationWriteInput, value: string) {
    markDirty();
    const normalized = value.trim() === "" ? null : value;
    setDraft((prev) =>
      patchDraft(prev, { [key]: normalized } as Partial<PublicationWriteInput>),
    );
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = publicationWriteSchema.safeParse(draft());
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }

    const body = publicationDraftToWriteBody(parsed.data);
    setPending(true);
    try {
      if (isEdit() && props.publicationId) {
        const updated = await adminPublicationsApi.update(
          props.publicationId,
          body,
        );
        setPublishStatus(updated.publishStatus);
        setDirty(false);
        setSavedMessage("Changes saved.");
        props.onSaved?.(updated);
      } else {
        const created = await adminPublicationsApi.create(body);
        setDirty(false);
        navigate(`/admin/publications/${created.id}`);
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  const d = draft;

  return (
    <form class="max-w-3xl min-w-0" onSubmit={handleSubmit}>
      <AdminPageHeader
        title={isEdit() ? "Edit publication" : "New publication"}
        description="Identity, scholarly metadata, SEO, and featured flags (A05). Publish controls ship in a later phase."
      >
        <Show when={isEdit()}>
          <PublishStatusBadge status={publishStatus()} />
          <Show when={props.publicationId}>
            <A
              href={`/admin/publications/${props.publicationId}`}
              class="siam-btn-secondary no-underline"
            >
              View publication
            </A>
          </Show>
        </Show>
        <A href="/admin/publications" class="siam-btn-secondary no-underline">
          Cancel
        </A>
      </AdminPageHeader>

      <Show when={formError()}>
        <div class="mt-4">
          <FormErrorAlert message={formError()} />
        </div>
      </Show>
      <FormSuccessNotice message={savedMessage()} />

      <fieldset class="siam-card mt-6 space-y-5 p-6">
        <legend class="text-lg font-semibold text-ink">Basics</legend>

        <FormField label="Title" name="title" required error={fieldErrors().title}>
          <FormTextInput
            name="title"
            value={d().title}
            onInput={(e) => updateTitle(e.currentTarget.value)}
            error={fieldErrors().title}
          />
        </FormField>

        <FormField label="Slug" name="slug" required error={fieldErrors().slug}>
          <FormTextInput
            name="slug"
            value={d().slug}
            onInput={(e) => {
              setSlugManual(true);
              markDirty();
              setDraft((prev) => patchDraft(prev, { slug: e.currentTarget.value }));
            }}
            error={fieldErrors().slug}
          />
          <p class="mt-1 text-xs text-ink-muted">
            Public URL:{" "}
            <span class="font-mono">
              /publications/{d().slug.trim() || "your-slug"}
            </span>
            {" · "}
            <button
              type="button"
              class="text-link text-xs"
              onClick={() => {
                setSlugManual(false);
                setDraft((prev) =>
                  patchDraft(prev, { slug: slugFromTitle(prev.title) }),
                );
                markDirty();
              }}
            >
              Reset from title
            </button>
          </p>
        </FormField>

        <FormField
          label="Authors"
          name="authors"
          required
          error={fieldErrors().authors}
        >
          <PublicationAuthorsEditor
            authors={d().authors}
            nameError={fieldErrors().authors}
            onDirty={markDirty}
            onChange={(authors) => setDraft((prev) => patchDraft(prev, { authors }))}
          />
        </FormField>

        <div class="grid gap-5 sm:grid-cols-2">
          <FormField label="Year" name="year" required error={fieldErrors().year}>
            <FormTextInput
              name="year"
              type="number"
              min={1900}
              max={2100}
              value={String(d().year)}
              onInput={(e) => {
                markDirty();
                const n = Number.parseInt(e.currentTarget.value, 10);
                setDraft((prev) =>
                  patchDraft(prev, {
                    year: Number.isNaN(n) ? prev.year : n,
                  }),
                );
              }}
              error={fieldErrors().year}
            />
          </FormField>

          <FormField label="Venue" name="venue" required error={fieldErrors().venue}>
            <FormTextInput
              name="venue"
              value={d().venue}
              onInput={(e) => {
                markDirty();
                setDraft((prev) =>
                  patchDraft(prev, { venue: e.currentTarget.value }),
                );
              }}
              error={fieldErrors().venue}
            />
          </FormField>
        </div>
      </fieldset>

      <fieldset class="siam-card mt-6 space-y-5 p-6">
        <legend class="text-lg font-semibold text-ink">Scholarly</legend>

        <FormField label="Publication type" name="publicationType">
          <select
            class="siam-input w-full"
            name="publicationType"
            value={d().publicationType}
            onChange={(e) => {
              markDirty();
              setDraft((prev) =>
                patchDraft(prev, {
                  publicationType: e.currentTarget
                    .value as PublicationWriteInput["publicationType"],
                }),
              );
            }}
          >
            <For each={PUBLICATION_TYPES}>
              {(type) => (
                <option value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              )}
            </For>
          </select>
        </FormField>

        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d().peerReviewed}
            onChange={(e) => {
              markDirty();
              setDraft((prev) =>
                patchDraft(prev, { peerReviewed: e.currentTarget.checked }),
              );
            }}
          />
          Peer reviewed
        </label>

        <FormField label="Abstract" name="abstract" error={fieldErrors().abstract}>
          <FormTextarea
            name="abstract"
            rows={5}
            value={d().abstract ?? ""}
            onInput={(e) => nullableField("abstract", e.currentTarget.value)}
            error={fieldErrors().abstract}
          />
        </FormField>

        <FormField label="DOI" name="doi" error={fieldErrors().doi}>
          <FormTextInput
            name="doi"
            value={d().doi ?? ""}
            onInput={(e) => nullableField("doi", e.currentTarget.value)}
            error={fieldErrors().doi}
          />
        </FormField>

        <FormField
          label="Publisher URL"
          name="publisherUrl"
          error={fieldErrors().publisherUrl}
        >
          <FormTextInput
            name="publisherUrl"
            value={d().publisherUrl ?? ""}
            onInput={(e) =>
              nullableField("publisherUrl", e.currentTarget.value)
            }
            error={fieldErrors().publisherUrl}
          />
        </FormField>
      </fieldset>

      <fieldset class="siam-card mt-6 space-y-5 p-6">
        <legend class="text-lg font-semibold text-ink">
          Supplementary materials
        </legend>
        <PublicationSupplementsEditor
          supplements={d().supplements}
          onDirty={markDirty}
          onChange={(supplements) =>
            setDraft((prev) => patchDraft(prev, { supplements }))
          }
        />
        <PublicationPdfSection
          pdfMediaId={d().pdfMediaId ?? null}
          pdfMedia={pdfMedia()}
          pdfRightsGranted={d().pdfRightsGranted}
          openAccess={d().openAccess}
          onDirty={markDirty}
          onChange={(patch) => {
            if (patch.pdfMedia !== undefined) {
              setPdfMedia(patch.pdfMedia);
            }
            const { pdfMedia: _pdfMedia, ...draftPatch } = patch;
            setDraft((prev) => patchDraft(prev, draftPatch));
          }}
        />
      </fieldset>

      <fieldset class="siam-card mt-6 space-y-5 p-6">
        <legend class="text-lg font-semibold text-ink">Story</legend>

        <FormField
          label="Significance"
          name="significance"
          error={fieldErrors().significance}
        >
          <FormTextarea
            name="significance"
            rows={3}
            value={d().significance ?? ""}
            onInput={(e) =>
              nullableField("significance", e.currentTarget.value)
            }
            error={fieldErrors().significance}
          />
        </FormField>

        <FormField
          label="Your contribution"
          name="ownerContribution"
          error={fieldErrors().ownerContribution}
        >
          <FormTextarea
            name="ownerContribution"
            rows={3}
            value={d().ownerContribution ?? ""}
            onInput={(e) =>
              nullableField("ownerContribution", e.currentTarget.value)
            }
            error={fieldErrors().ownerContribution}
          />
        </FormField>

        <FormField
          label="Correction notice"
          name="correctionNotice"
          error={fieldErrors().correctionNotice}
        >
          <FormTextarea
            name="correctionNotice"
            rows={2}
            value={d().correctionNotice ?? ""}
            onInput={(e) =>
              nullableField("correctionNotice", e.currentTarget.value)
            }
            error={fieldErrors().correctionNotice}
          />
        </FormField>
      </fieldset>

      <fieldset class="siam-card mt-6 space-y-5 p-6">
        <legend class="text-lg font-semibold text-ink">SEO</legend>

        <FormField label="SEO title" name="seoTitle" error={fieldErrors().seoTitle}>
          <FormTextInput
            name="seoTitle"
            value={d().seoTitle ?? ""}
            onInput={(e) => nullableField("seoTitle", e.currentTarget.value)}
            error={fieldErrors().seoTitle}
          />
        </FormField>

        <FormField
          label="SEO description"
          name="seoDescription"
          error={fieldErrors().seoDescription}
        >
          <FormTextarea
            name="seoDescription"
            rows={3}
            value={d().seoDescription ?? ""}
            onInput={(e) =>
              nullableField("seoDescription", e.currentTarget.value)
            }
            error={fieldErrors().seoDescription}
          />
        </FormField>

        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d().hideFromSearch}
            onChange={(e) => {
              markDirty();
              setDraft((prev) =>
                patchDraft(prev, { hideFromSearch: e.currentTarget.checked }),
              );
            }}
          />
          Hide from site search
        </label>
      </fieldset>

      <fieldset class="siam-card mt-6 space-y-5 p-6">
        <legend class="text-lg font-semibold text-ink">Featured</legend>

        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d().featured}
            onChange={(e) => {
              markDirty();
              setDraft((prev) =>
                patchDraft(prev, { featured: e.currentTarget.checked }),
              );
            }}
          />
          Featured publication
        </label>

        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d().featuredOnHome}
            onChange={(e) => {
              markDirty();
              setDraft((prev) =>
                patchDraft(prev, { featuredOnHome: e.currentTarget.checked }),
              );
            }}
          />
          Featured on home
        </label>
      </fieldset>

      <div class="mt-6 flex flex-wrap gap-3">
        <button type="submit" class="siam-btn-primary" disabled={pending()}>
          {pending()
            ? "Saving…"
            : isEdit()
              ? "Save changes"
              : "Save draft"}
        </button>
        <A href="/admin/publications" class="siam-btn-secondary no-underline">
          Cancel
        </A>
      </div>
    </form>
  );
}
