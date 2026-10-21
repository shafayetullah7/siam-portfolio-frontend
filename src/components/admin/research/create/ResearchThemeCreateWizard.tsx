import { A, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import type { CollaboratorRow } from "~/components/admin/research/CollaboratorsEditor";
import type { ThemeResourceRow } from "~/components/admin/research/ThemeResourcesEditor";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import { adminMediaApi } from "~/lib/api/endpoints/admin/media.api";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import type { ResearchThemeAdmin } from "~/lib/api/types/admin.types";
import type {
  ResearchThemeProjectLink,
  ResearchThemePublicationLink,
} from "~/lib/api/types/research.types";
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
  isDraftSubmittable,
  maxWizardStep,
  type ResearchThemeCreateDraft,
  wizardStepForField,
  wizardSteps,
} from "./createWizard.types";
import ResearchThemeEditExtras from "./ResearchThemeEditExtras";

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

function tagsToInput(tags: string[] | null | undefined): string {
  return tags?.join(", ") ?? "";
}

export type ResearchThemeCreateWizardProps = {
  /** Omit or `"new"` for create; theme UUID for edit. */
  themeId?: string;
};

export default function ResearchThemeCreateWizard(
  props: ResearchThemeCreateWizardProps,
) {
  const themeId = () => props.themeId ?? "new";
  const isEdit = () => themeId() !== "new";

  const [step, setStep] = createSignal(1);
  const [draft, setDraft] = createSignal<ResearchThemeCreateDraft>(
    emptyCreateDraft(),
  );
  const [slugManual, setSlugManual] = createSignal(false);
  const [coverPickerOpen, setCoverPickerOpen] = createSignal(false);
  const [dirty, setDirty] = createSignal(false);
  const [loading, setLoading] = createSignal(isEdit());
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [publishStatus, setPublishStatus] = createSignal("draft");
  const [collaborators, setCollaborators] = createSignal<CollaboratorRow[]>([]);
  const [acknowledgments, setAcknowledgments] = createSignal("");
  const [funding, setFunding] = createSignal("");
  const [resources, setResources] = createSignal<ThemeResourceRow[]>([]);
  const [seoTitle, setSeoTitle] = createSignal("");
  const [seoDescription, setSeoDescription] = createSignal("");
  const [sortOrder, setSortOrder] = createSignal("0");
  const [featuredOnHome, setFeaturedOnHome] = createSignal(false);
  const [linkLabel, setLinkLabel] = createSignal("");
  const [publicationLinks, setPublicationLinks] = createSignal<
    ResearchThemePublicationLink[]
  >([]);
  const [projectLinks, setProjectLinks] = createSignal<
    ResearchThemeProjectLink[]
  >([]);

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

  createEffect(() => {
    if (saveSubmission.result?.ok) {
      setDirty(false);
    }
  });

  async function loadCoverIntoDraft(
    base: ResearchThemeCreateDraft,
    mediaId: string | null,
  ): Promise<ResearchThemeCreateDraft> {
    if (!mediaId) {
      return {
        ...base,
        coverMediaId: null,
        coverPreviewUrl: null,
        coverPreviewAlt: null,
      };
    }
    try {
      const media = await adminMediaApi.get(mediaId);
      return {
        ...base,
        coverMediaId: mediaId,
        coverPreviewUrl: media.url,
        coverPreviewAlt: media.alt,
      };
    } catch {
      return {
        ...base,
        coverMediaId: mediaId,
        coverPreviewUrl: null,
        coverPreviewAlt: null,
      };
    }
  }

  async function applyTheme(theme: ResearchThemeAdmin) {
    setPublishStatus(theme.publishStatus);
    setSlugManual(true);
    const base: ResearchThemeCreateDraft = {
      ...emptyCreateDraft(),
      title: theme.title,
      slug: theme.slug,
      summary: theme.summary,
      themeStatus: theme.themeStatus,
      tagsInput: tagsToInput(theme.tags),
      problem: theme.problem,
      significance: theme.significance ?? "",
      objectives: theme.objectives ?? "",
      approach: theme.approach ?? "",
      findings: theme.findings ?? "",
      limitations: theme.limitations ?? "",
      futureWork: theme.futureWork ?? "",
    };
    setDraft(await loadCoverIntoDraft(base, theme.coverMediaId));
    setCollaborators(
      theme.collaborators?.map((c) => ({
        name: c.name,
        role: c.role ?? "",
        url: c.url ?? "",
      })) ?? [],
    );
    setAcknowledgments(theme.acknowledgments ?? "");
    setFunding(theme.funding ?? "");
    setResources(
      theme.resources.map((r) => ({
        label: r.label,
        url: r.url,
        resourceType: r.resourceType,
      })),
    );
    setSeoTitle(theme.seoTitle ?? "");
    setSeoDescription(theme.seoDescription ?? "");
    setSortOrder(String(theme.sortOrder));
    setFeaturedOnHome(theme.featuredOnHome);
    setLinkLabel(theme.linkLabel ?? "");
  }

  onMount(async () => {
    if (!isEdit()) return;
    try {
      const theme = await adminResearchApi.get(themeId());
      await applyTheme(theme);
      setDirty(false);
      const [pubs, projects] = await Promise.all([
        adminResearchApi.getPublications(themeId()),
        adminResearchApi.getProjects(themeId()),
      ]);
      setPublicationLinks(pubs);
      setProjectLinks(projects);
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

  const d = draft;
  const canSave = () => isDraftSubmittable(d());
  const maxStep = () => maxWizardStep(isEdit());

  const formActionId = () => (isEdit() ? themeId() : "new");
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
          title="Theme not found"
          description="This theme may have been deleted or the link is wrong."
        >
          <A href="/admin/research" class="siam-btn-primary no-underline">
            Back to research
          </A>
        </EmptyState>
      }
    >
      <Show
        when={!loading()}
        fallback={
          <p class="text-sm text-ink-muted" role="status">Loading theme…</p>
        }
      >
        <div class="max-w-4xl min-w-0">
          <AdminPageHeader
            title={
              isEdit() ? "Edit research theme" : "Create research theme"
            }
            description={
              isEdit()
                ? "Four steps: basics and story, then review, then more links and settings. Jump anytime; required fields are marked with *."
                : "Three quick steps. After saving, open the theme to link outputs and publish."
            }
          >
            <Show when={isEdit()}>
              <PublishStatusBadge status={publishStatus()} />
              <A
                href={`/admin/research/${themeId()}`}
                class="siam-btn-secondary no-underline"
              >
                View theme
              </A>
            </Show>
            <A href="/admin/research" class="siam-btn-secondary no-underline">
              Cancel
            </A>
          </AdminPageHeader>

          <Show when={loadError()}>
            <p class="mb-4 text-sm text-error" role="alert">{loadError()}</p>
          </Show>

          <CreateWizardProgress
            steps={wizardSteps(isEdit())}
            currentStep={step()}
            onStepSelect={setStep}
          />

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

          <Show when={step() >= 3}>
            <form
              id="research-theme-form"
              class="min-w-0"
              method="post"
              action={saveResearchThemeAction.with(formActionId())}
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
              <input type="hidden" name="coverMediaId" value={d().coverMediaId ?? ""} />
              <Show when={!isEdit()}>
                <input type="hidden" name="sortOrder" value="0" />
                <input type="hidden" name="acknowledgments" value="" />
                <input type="hidden" name="funding" value="" />
                <input type="hidden" name="collaboratorsJson" value="[]" />
                <input type="hidden" name="resourcesJson" value="[]" />
                <input type="hidden" name="seoTitle" value="" />
                <input type="hidden" name="seoDescription" value="" />
                <input type="hidden" name="linkLabel" value="" />
              </Show>
              <Show when={step() === 3}>
                <CreateReviewStep
                  draft={d()}
                  formMessage={formMessage()}
                  isEdit={isEdit()}
                  canSave={canSave()}
                />
              </Show>
              <Show when={step() === 4 && isEdit()}>
                <ResearchThemeEditExtras
                  themeId={themeId()}
                  formMessage={formMessage()}
                  collaborators={collaborators()}
                  acknowledgments={acknowledgments()}
                  funding={funding()}
                  resources={resources()}
                  seoTitle={seoTitle()}
                  seoDescription={seoDescription()}
                  sortOrder={sortOrder()}
                  featuredOnHome={featuredOnHome()}
                  linkLabel={linkLabel()}
                  publicationLinks={publicationLinks()}
                  projectLinks={projectLinks()}
                  onCollaboratorsChange={setCollaborators}
                  onAcknowledgmentsChange={setAcknowledgments}
                  onFundingChange={setFunding}
                  onResourcesChange={setResources}
                  onSeoTitleChange={setSeoTitle}
                  onSeoDescriptionChange={setSeoDescription}
                  onSortOrderChange={setSortOrder}
                  onFeaturedOnHomeChange={setFeaturedOnHome}
                  onLinkLabelChange={setLinkLabel}
                  onPublicationLinksChange={setPublicationLinks}
                  onProjectLinksChange={setProjectLinks}
                  onDirty={markDirty}
                />
              </Show>
            </form>
          </Show>

          <div
            class="sticky bottom-0 z-10 mt-8 border-t border-border bg-canvas/95 py-4 backdrop-blur"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
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
                when={step() < maxStep()}
                fallback={
                  <button
                    type="submit"
                    class="siam-btn-primary"
                    form="research-theme-form"
                    disabled={saveSubmission.pending || !canSave()}
                    title={
                      canSave()
                        ? undefined
                        : "Fill all required fields (marked with *) on Basics and Story"
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
