import { For } from "solid-js";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import PublicationPdfSection from "~/components/admin/publications/PublicationPdfSection";
import PublicationSupplementsEditor from "~/components/admin/publications/PublicationSupplementsEditor";
import {
  PUBLICATION_TYPES,
  type PublicationWriteInput,
} from "~/lib/forms/schemas/publication-write.schema";
import type { PublicationPdfMediaSummary } from "~/lib/api/types/publication.types";
import type { PublicationWizardDraft } from "./publicationWizard.types";

export type PublicationScholarlyStepProps = {
  draft: PublicationWizardDraft;
  fieldErrors: Record<string, string>;
  pdfMedia: PublicationPdfMediaSummary | null;
  onDraftChange: (patch: Partial<PublicationWizardDraft>) => void;
  onPdfMediaChange: (media: PublicationPdfMediaSummary | null) => void;
  onDirty: () => void;
};

export default function PublicationScholarlyStep(
  props: PublicationScholarlyStepProps,
) {
  const d = () => props.draft;

  function nullableField(key: keyof PublicationWriteInput, value: string) {
    props.onDirty();
    const normalized = value.trim() === "" ? null : value;
    props.onDraftChange({ [key]: normalized } as Partial<PublicationWizardDraft>);
  }

  return (
    <div class="space-y-6">
      <div class="siam-card space-y-5 p-6">
        <div>
          <p class="siam-eyebrow text-secondary">Step 2</p>
          <h2 class="text-lg font-semibold text-ink">Scholarly metadata</h2>
          <p class="mt-1 text-sm text-ink-muted">
            Type, abstract, identifiers, and optional PDF or supplementary files.
          </p>
        </div>

        <FormField label="Publication type" name="publicationType">
          <select
            class="siam-input w-full"
            name="publicationType"
            value={d().publicationType}
            onChange={(e) => {
              props.onDirty();
              props.onDraftChange({
                publicationType: e.currentTarget
                  .value as PublicationWriteInput["publicationType"],
              });
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
              props.onDirty();
              props.onDraftChange({ peerReviewed: e.currentTarget.checked });
            }}
          />
          Peer reviewed
        </label>

        <FormField label="Abstract" name="abstract" error={props.fieldErrors.abstract}>
          <FormTextarea
            name="abstract"
            rows={5}
            value={d().abstract ?? ""}
            onInput={(e) => nullableField("abstract", e.currentTarget.value)}
            error={props.fieldErrors.abstract}
          />
        </FormField>

        <FormField label="DOI" name="doi" error={props.fieldErrors.doi}>
          <FormTextInput
            name="doi"
            value={d().doi ?? ""}
            onInput={(e) => nullableField("doi", e.currentTarget.value)}
            error={props.fieldErrors.doi}
          />
        </FormField>

        <FormField
          label="Publisher URL"
          name="publisherUrl"
          error={props.fieldErrors.publisherUrl}
        >
          <FormTextInput
            name="publisherUrl"
            value={d().publisherUrl ?? ""}
            onInput={(e) =>
              nullableField("publisherUrl", e.currentTarget.value)
            }
            error={props.fieldErrors.publisherUrl}
          />
        </FormField>
      </div>

      <div class="siam-card space-y-5 p-6">
        <h3 class="text-base font-semibold text-ink">Supplementary materials</h3>
        <PublicationSupplementsEditor
          supplements={d().supplements}
          onDirty={props.onDirty}
          onChange={(supplements) => props.onDraftChange({ supplements })}
        />
        <PublicationPdfSection
          pdfMediaId={d().pdfMediaId ?? null}
          pdfMedia={props.pdfMedia}
          pdfRightsGranted={d().pdfRightsGranted}
          openAccess={d().openAccess}
          onDirty={props.onDirty}
          onChange={(patch) => {
            if (patch.pdfMedia !== undefined) {
              props.onPdfMediaChange(patch.pdfMedia);
            }
            const { pdfMedia: _pdfMedia, ...draftPatch } = patch;
            props.onDraftChange(draftPatch);
          }}
        />
      </div>
    </div>
  );
}
