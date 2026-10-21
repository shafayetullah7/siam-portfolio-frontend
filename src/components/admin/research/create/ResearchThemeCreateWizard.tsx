import { A, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import { saveResearchThemeAction } from "~/lib/forms/actions/admin-research.actions";
import type { FormActionResult } from "~/lib/forms/types";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import CreateBasicsStep from "./CreateBasicsStep";
import CreateReviewStep from "./CreateReviewStep";
import CreateStoryStep from "./CreateStoryStep";
import CreateWizardProgress from "./CreateWizardProgress";
import {
  emptyCreateDraft,
  isCreateDraftDirty,
  isStep1Valid,
  isStep2Valid,
  type ResearchThemeCreateDraft,
  wizardStepForField,
} from "./createWizard.types";

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

export default function ResearchThemeCreateWizard() {
  const [step, setStep] = createSignal(1);
  const [draft, setDraft] = createSignal<ResearchThemeCreateDraft>(
    emptyCreateDraft(),
  );
  const [slugManual, setSlugManual] = createSignal(false);
  const [coverPickerOpen, setCoverPickerOpen] = createSignal(false);
  const [dirty, setDirty] = createSignal(false);

  const saveSubmission = useSubmission(saveResearchThemeAction);
  const fieldErrors = () => resultFieldErrors(saveSubmission.result);
  const formMessage = () => {
    const fromResult = resultMessage(saveSubmission.result);
    if (fromResult) return fromResult;
    if (saveSubmission.error) return saveSubmission.error.message;
    return null;
  };

  useUnsavedChanges(dirty);

  createEffect(() => {
    const errors = fieldErrors();
    const keys = Object.keys(errors);
    if (keys.length > 0) {
      setStep(wizardStepForField(keys[0]));
    }
  });

  function patchDraft(patch: Partial<ResearchThemeCreateDraft>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      if (isCreateDraftDirty(next)) setDirty(true);
      return next;
    });
  }

  function markDirty() {
    setDirty(true);
  }

  const canNext = () => {
    if (step() === 1) return isStep1Valid(draft());
    if (step() === 2) return isStep2Valid(draft());
    return true;
  };

  const d = draft;

  return (
    <div class="max-w-4xl pb-28">
      <AdminPageHeader
        title="Create research theme"
        description="Three quick steps. After saving, use the full editor to link outputs and publish."
      >
        <A href="/admin/research" class="siam-btn-secondary no-underline">
          Cancel
        </A>
      </AdminPageHeader>

      <CreateWizardProgress currentStep={step()} />

      <Show when={step() === 1}>
        <CreateBasicsStep
          draft={d()}
          slugManual={slugManual()}
          coverPickerOpen={coverPickerOpen()}
          fieldErrors={fieldErrors()}
          onDraftChange={patchDraft}
          onSlugManualChange={setSlugManual}
          onCoverPickerOpen={setCoverPickerOpen}
          onDirty={markDirty}
        />
      </Show>

      <Show when={step() === 2}>
        <CreateStoryStep
          draft={d()}
          fieldErrors={fieldErrors()}
          onDraftChange={patchDraft}
          onDirty={markDirty}
        />
      </Show>

      <Show when={step() === 3}>
        <form
          id="research-create-form"
          method="post"
          action={saveResearchThemeAction.with("new")}
          onInput={markDirty}
        >
          <input type="hidden" name="title" value={d().title} />
          <input type="hidden" name="slug" value={d().slug} />
          <input type="hidden" name="summary" value={d().summary} />
          <input type="hidden" name="themeStatus" value={d().themeStatus} />
          <input type="hidden" name="tags" value={d().tagsInput} />
          <input type="hidden" name="problem" value={d().problem} />
          <input type="hidden" name="significance" value={d().significance} />
          <input type="hidden" name="objectives" value={d().objectives} />
          <input type="hidden" name="approach" value={d().approach} />
          <input type="hidden" name="findings" value={d().findings} />
          <input type="hidden" name="limitations" value={d().limitations} />
          <input type="hidden" name="futureWork" value={d().futureWork} />
          <input type="hidden" name="sortOrder" value="0" />
          <input
            type="hidden"
            name="coverMediaId"
            value={d().coverMediaId ?? ""}
          />
          <input type="hidden" name="acknowledgments" value="" />
          <input type="hidden" name="funding" value="" />
          <input type="hidden" name="collaboratorsJson" value="[]" />
          <input type="hidden" name="resourcesJson" value="[]" />
          <CreateReviewStep draft={d()} formMessage={formMessage()} />
        </form>
      </Show>

      <div
        class="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-canvas/95 px-4 py-4 backdrop-blur sm:px-6"
      >
        <div class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
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
            <A href="/admin/research" class="siam-btn-secondary no-underline">
              Cancel
            </A>
          </div>
          <Show
            when={step() < 3}
            fallback={
              <button
                type="submit"
                class="siam-btn-primary"
                form="research-create-form"
                disabled={saveSubmission.pending}
              >
                {saveSubmission.pending ? "Saving…" : "Save draft"}
              </button>
            }
          >
            <button
              type="button"
              class="siam-btn-primary"
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}
