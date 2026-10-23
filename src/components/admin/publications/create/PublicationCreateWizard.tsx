import { A, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import type { PublicationPdfMediaSummary } from "~/lib/api/types/publication.types";
import { savePublicationAction } from "~/lib/forms/actions/admin-publications.actions";
import type { FormActionResult } from "~/lib/forms/types";
import {
  fieldErrorsFromZod,
  publicationDraftFromAdmin,
  publicationWriteSchema,
} from "~/lib/forms/schemas/publication-write.schema";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import PublicationBasicsStep from "./PublicationBasicsStep";
import PublicationReviewStep from "./PublicationReviewStep";
import PublicationScholarlyStep from "./PublicationScholarlyStep";
import PublicationStoryDisplayStep from "./PublicationStoryDisplayStep";
import PublicationWizardProgress from "./PublicationWizardProgress";
import {
  emptyWizardDraft,
  isDraftSubmittable,
  isPublicationDraftDirty,
  maxWizardStep,
  type PublicationWizardDraft,
  wizardStepForField,
  wizardSteps,
} from "./publicationWizard.types";

function resultFieldErrors(
  result: FormActionResult | undefined,
): Record<string, string> {
  if (result && !result.ok && result.fieldErrors) return result.fieldErrors;
  return {};
}

function resultMessage(result: FormActionResult | undefined): string | null {
  if (result && !result.ok) return result.formMessage;
  return null;
}

export type PublicationCreateWizardProps = {
  /** Omit or `"new"` for create; publication UUID for edit. */
  publicationId?: string;
};

export default function PublicationCreateWizard(
  props: PublicationCreateWizardProps,
) {
  const publicationId = () => props.publicationId ?? "new";
  const isEdit = () => publicationId() !== "new";
  const formActionId = () => publicationId();

  const [step, setStep] = createSignal(1);
  const [draft, setDraft] = createSignal<PublicationWizardDraft>(
    emptyWizardDraft(),
  );
  const [slugManual, setSlugManual] = createSignal(false);
  const [clientFieldErrors, setClientFieldErrors] = createSignal<
    Record<string, string>
  >({});
  const [savedMessage, setSavedMessage] = createSignal<string | null>(null);
  const [dirty, setDirty] = createSignal(false);
  const [loading, setLoading] = createSignal(isEdit());
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [publishStatus, setPublishStatus] = createSignal("draft");
  const [pdfMedia, setPdfMedia] = createSignal<PublicationPdfMediaSummary | null>(
    null,
  );

  const saveSubmission = useSubmission(savePublicationAction);
  const fieldErrors = () => ({
    ...clientFieldErrors(),
    ...resultFieldErrors(saveSubmission.result),
  });
  const formMessage = () => {
    const fromResult = resultMessage(saveSubmission.result);
    if (fromResult) return fromResult;
    if (saveSubmission.error) return saveSubmission.error.message;
    return loadError();
  };

  useUnsavedChanges(dirty);

  createEffect(() => {
    const errors = fieldErrors();
    const keys = Object.keys(errors);
    if (keys.length > 0) {
      setStep(wizardStepForField(keys[0]));
    }
  });

  createEffect(() => {
    if (saveSubmission.result?.ok) {
      setDirty(false);
      if (isEdit()) {
        setSavedMessage("Changes saved.");
      }
    }
  });

  onMount(async () => {
    if (!isEdit()) return;
    try {
      const row = await adminPublicationsApi.get(publicationId());
      setDraft(publicationDraftFromAdmin(row));
      setPublishStatus(row.publishStatus);
      setPdfMedia(row.pdfMedia ?? null);
      setSlugManual(true);
      setDirty(false);
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        setNotFound(true);
      } else {
        setLoadError(getApiErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  });

  function patchDraft(patch: Partial<PublicationWizardDraft>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      if (isPublicationDraftDirty(next)) setDirty(true);
      return next;
    });
  }

  function markDirty() {
    setDirty(true);
    setSavedMessage(null);
  }

  function handleSubmit(e: SubmitEvent) {
    setClientFieldErrors({});
    setLoadError(null);
    const parsed = publicationWriteSchema.safeParse(draft());
    if (!parsed.success) {
      e.preventDefault();
      setClientFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
  }

  const d = draft;
  const canSave = () => isDraftSubmittable(d());
  const maxStep = () => maxWizardStep(isEdit());
  const reviewStepNumber = () => (isEdit() ? 4 : 3);

  const saveLabel = () =>
    isEdit()
      ? saveSubmission.pending
        ? "Saving…"
        : "Save changes"
      : saveSubmission.pending
        ? "Saving…"
        : "Save draft";

  const formStartsAtStep = () => (isEdit() ? 3 : 3);

  return (
    <Show
      when={!notFound()}
      fallback={
        <EmptyState
          variant="list"
          title="Publication not found"
          description="This publication may have been deleted or the link is wrong."
        >
          <A href="/admin/publications" class="siam-btn-primary no-underline">
            Back to publications
          </A>
        </EmptyState>
      }
    >
      <Show
        when={!loading()}
        fallback={
          <p class="text-sm text-ink-muted" role="status">Loading publication…</p>
        }
      >
        <div class="max-w-4xl min-w-0">
          <AdminPageHeader
            stackActions
            title={isEdit() ? "Edit publication" : "New publication"}
            description={
              isEdit()
                ? "Four steps: basics and scholarly metadata, story and display, then review and save."
                : "Three steps. Save a draft, then open the publication to publish."
            }
          >
            <Show when={isEdit()}>
              <PublishStatusBadge status={publishStatus()} />
              <A
                href={`/admin/publications/${publicationId()}`}
                class="siam-btn-secondary no-underline"
              >
                View publication
              </A>
            </Show>
            <A href="/admin/publications" class="siam-btn-secondary no-underline">
              Cancel
            </A>
          </AdminPageHeader>

          <Show when={formMessage() && step() < formStartsAtStep()}>
            <div class="mt-4">
              <FormErrorAlert message={formMessage()!} />
            </div>
          </Show>
          <Show when={savedMessage()}>
            <div class="mt-4">
              <FormSuccessNotice message={savedMessage()} />
            </div>
          </Show>

          <PublicationWizardProgress
            steps={wizardSteps(isEdit())}
            currentStep={step()}
            onStepSelect={setStep}
          />

          <Show when={step() === 1}>
            <PublicationBasicsStep
              draft={d()}
              slugManual={slugManual()}
              fieldErrors={fieldErrors()}
              onDraftChange={patchDraft}
              onSlugManualChange={setSlugManual}
              onDirty={markDirty}
            />
          </Show>

          <Show when={step() === 2}>
            <PublicationScholarlyStep
              draft={d()}
              fieldErrors={fieldErrors()}
              pdfMedia={pdfMedia()}
              onDraftChange={patchDraft}
              onPdfMediaChange={setPdfMedia}
              onDirty={markDirty}
            />
          </Show>

          <Show when={step() >= formStartsAtStep()}>
            <form
              id="publication-wizard-form"
              class="min-w-0"
              method="post"
              action={savePublicationAction.with(formActionId())}
              onSubmit={handleSubmit}
              onInput={markDirty}
            >
              <input
                type="hidden"
                name="publicationDraftJson"
                value={JSON.stringify(draft())}
              />

              <Show when={step() === 3 && isEdit()}>
                <PublicationStoryDisplayStep
                  draft={d()}
                  fieldErrors={fieldErrors()}
                  onDraftChange={patchDraft}
                  onDirty={markDirty}
                />
              </Show>

              <Show when={step() === reviewStepNumber()}>
                <PublicationReviewStep
                  draft={d()}
                  formMessage={formMessage()}
                  isEdit={isEdit()}
                  canSave={canSave()}
                  stepNumber={reviewStepNumber()}
                />
              </Show>
            </form>
          </Show>

          <div
            class="sticky bottom-0 z-10 -mx-1 mt-10 border-t border-border bg-canvas/95 px-1 py-5 backdrop-blur"
          >
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex gap-2">
                <Show when={step() > 1}>
                  <button
                    type="button"
                    class="siam-btn-secondary"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    Back
                  </button>
                </Show>
                <A
                  href="/admin/publications"
                  class="siam-btn-secondary no-underline"
                >
                  Cancel
                </A>
              </div>
              <Show
                when={step() < maxStep()}
                fallback={
                  <button
                    type="submit"
                    class="siam-btn-primary"
                    form="publication-wizard-form"
                    disabled={saveSubmission.pending || !canSave()}
                    title={
                      canSave()
                        ? undefined
                        : "Fill required fields on Basics (marked with *)"
                    }
                  >
                    {saveLabel()}
                  </button>
                }
              >
                <button
                  type="button"
                  class="siam-btn-primary"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Next
                </button>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </Show>
  );
}
