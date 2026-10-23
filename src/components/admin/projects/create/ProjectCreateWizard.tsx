import { A, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import { adminProjectsApi } from "~/lib/api/endpoints/admin/projects.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import { saveProjectAction } from "~/lib/forms/actions/admin-projects.actions";
import type { FormActionResult } from "~/lib/forms/types";
import {
  fieldErrorsFromZod,
  projectDraftFromAdmin,
  projectWriteSchema,
} from "~/lib/forms/schemas/project-write.schema";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import ProjectBasicsStep from "./ProjectBasicsStep";
import ProjectCaseStudyStep from "./ProjectCaseStudyStep";
import ProjectDisplaySeoStep from "./ProjectDisplaySeoStep";
import ProjectResourcesStep from "./ProjectResourcesStep";
import ProjectReviewStep from "./ProjectReviewStep";
import ProjectWizardProgress from "./ProjectWizardProgress";
import { resourcesHttpsValid } from "./ProjectResourcesEditor";
import {
  emptyWizardDraft,
  formStartsAtStep,
  isDraftSubmittable,
  isProjectDraftDirty,
  maxWizardStep,
  reviewStepNumber,
  type ProjectWizardDraft,
  wizardStepForField,
  wizardSteps,
} from "./projectWizard.types";

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

export type ProjectCreateWizardProps = {
  projectId?: string;
};

export default function ProjectCreateWizard(props: ProjectCreateWizardProps) {
  const projectId = () => props.projectId ?? "new";
  const isEdit = () => projectId() !== "new";
  const formActionId = () => projectId();

  const [step, setStep] = createSignal(1);
  const [draft, setDraft] = createSignal<ProjectWizardDraft>(emptyWizardDraft());
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

  const saveSubmission = useSubmission(saveProjectAction);
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
      setStep(wizardStepForField(keys[0], isEdit()));
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
      const row = await adminProjectsApi.get(projectId());
      setDraft(projectDraftFromAdmin(row));
      setPublishStatus(row.publishStatus);
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

  function patchDraft(patch: Partial<ProjectWizardDraft>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      if (isProjectDraftDirty(next)) setDirty(true);
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
    const current = draft();
    if (!resourcesHttpsValid(current.resources ?? [])) {
      e.preventDefault();
      setClientFieldErrors({
        resources: "Resource URLs must use HTTPS.",
      });
      setStep(3);
      return;
    }
    const parsed = projectWriteSchema.safeParse(current);
    if (!parsed.success) {
      e.preventDefault();
      setClientFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
  }

  const d = draft;
  const canSave = () => isDraftSubmittable(d());
  const maxStep = () => maxWizardStep(isEdit());
  const reviewStep = () => reviewStepNumber(isEdit());
  const formStart = () => formStartsAtStep(isEdit());

  const saveLabel = () =>
    isEdit()
      ? saveSubmission.pending
        ? "Saving…"
        : "Save changes"
      : saveSubmission.pending
        ? "Saving…"
        : "Save draft";

  return (
    <Show
      when={!notFound()}
      fallback={
        <EmptyState
          variant="list"
          title="Project not found"
          description="This project may have been deleted or the link is wrong."
        >
          <A href="/admin/projects" class="siam-btn-primary no-underline">
            Back to projects
          </A>
        </EmptyState>
      }
    >
      <Show
        when={!loading()}
        fallback={
          <p class="text-sm text-ink-muted" role="status">Loading project…</p>
        }
      >
        <div class="max-w-4xl min-w-0">
          <AdminPageHeader
            stackActions
            title={isEdit() ? "Edit project" : "New project"}
            description={
              isEdit()
                ? "Five steps: basics, case study, resources, display and SEO, then review."
                : "Four steps. Save a draft, then open the project overview."
            }
          >
            <Show when={isEdit()}>
              <PublishStatusBadge status={publishStatus()} />
              <A
                href={`/admin/projects/${projectId()}`}
                class="siam-btn-secondary no-underline"
              >
                View project
              </A>
            </Show>
            <A href="/admin/projects" class="siam-btn-secondary no-underline">
              Cancel
            </A>
          </AdminPageHeader>

          <Show when={formMessage() && step() < formStart()}>
            <div class="mt-4">
              <FormErrorAlert message={formMessage()!} />
            </div>
          </Show>
          <Show when={savedMessage()}>
            <div class="mt-4">
              <FormSuccessNotice message={savedMessage()} />
            </div>
          </Show>

          <ProjectWizardProgress
            steps={wizardSteps(isEdit())}
            currentStep={step()}
            onStepSelect={setStep}
          />

          <Show when={step() === 1}>
            <ProjectBasicsStep
              draft={d()}
              slugManual={slugManual()}
              fieldErrors={fieldErrors()}
              onDraftChange={patchDraft}
              onSlugManualChange={setSlugManual}
              onDirty={markDirty}
            />
          </Show>

          <Show when={step() === 2}>
            <ProjectCaseStudyStep
              draft={d()}
              onDraftChange={patchDraft}
              onDirty={markDirty}
            />
          </Show>

          <Show when={step() === 3}>
            <ProjectResourcesStep
              draft={d()}
              fieldErrors={fieldErrors()}
              onDraftChange={patchDraft}
              onDirty={markDirty}
            />
          </Show>

          <Show when={step() >= formStart()}>
            <form
              id="project-wizard-form"
              class="min-w-0"
              method="post"
              action={saveProjectAction.with(formActionId())}
              onSubmit={handleSubmit}
              onInput={markDirty}
            >
              <input
                type="hidden"
                name="projectDraftJson"
                value={JSON.stringify(draft())}
              />

              <Show when={step() === 4 && isEdit()}>
                <ProjectDisplaySeoStep
                  draft={d()}
                  fieldErrors={fieldErrors()}
                  onDraftChange={patchDraft}
                  onDirty={markDirty}
                />
              </Show>

              <Show when={step() === reviewStep()}>
                <ProjectReviewStep
                  draft={d()}
                  formMessage={formMessage()}
                  isEdit={isEdit()}
                  canSave={canSave()}
                  stepNumber={reviewStep()}
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
                <A href="/admin/projects" class="siam-btn-secondary no-underline">
                  Cancel
                </A>
              </div>
              <Show
                when={step() < maxStep()}
                fallback={
                  <button
                    type="submit"
                    class="siam-btn-primary"
                    form="project-wizard-form"
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
