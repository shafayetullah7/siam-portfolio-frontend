import { A, useAction, useNavigate, useParams, useSubmission } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import CollaboratorsEditor, {
  type CollaboratorRow,
} from "~/components/admin/research/CollaboratorsEditor";
import ResearchPublishChecklistDialog from "~/components/admin/research/ResearchPublishChecklistDialog";
import ResearchRevisionsPanel from "~/components/admin/research/ResearchRevisionsPanel";
import ThemeProjectsEditor from "~/components/admin/research/ThemeProjectsEditor";
import ThemePublicationsEditor from "~/components/admin/research/ThemePublicationsEditor";
import ThemeResourcesEditor, {
  type ThemeResourceRow,
} from "~/components/admin/research/ThemeResourcesEditor";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import { adminMediaApi } from "~/lib/api/endpoints/admin/media.api";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import {
  archiveResearchThemeAction,
  publishResearchThemeAction,
  saveResearchThemeAction,
  scheduleResearchThemeAction,
  unpublishResearchThemeAction,
} from "~/lib/forms/actions/admin-research.actions";
import type { ResearchThemeAdmin } from "~/lib/api/types/admin.types";
import type {
  ResearchPublishChecklist,
  ResearchThemeProjectLink,
  ResearchThemePublicationLink,
} from "~/lib/api/types/research.types";
import type { FormActionResult } from "~/lib/forms/types";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";

function resultMessage(result: FormActionResult | undefined): string | null {
  if (result && !result.ok) return result.formMessage;
  return null;
}

function resultFieldErrors(
  result: FormActionResult | undefined,
): Record<string, string> {
  if (result && !result.ok && result.fieldErrors) return result.fieldErrors;
  return {};
}

function tagsToInput(tags: string[] | null | undefined): string {
  return tags?.join(", ") ?? "";
}

export default function AdminResearchEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const themeId = () => params.id ?? "new";
  const saveSubmission = useSubmission(saveResearchThemeAction);
  const publishSubmission = useSubmission(publishResearchThemeAction);
  const runPublish = useAction(publishResearchThemeAction);
  const unpublishSubmission = useSubmission(unpublishResearchThemeAction);
  const archiveSubmission = useSubmission(archiveResearchThemeAction);
  const scheduleSubmission = useSubmission(scheduleResearchThemeAction);

  const [title, setTitle] = createSignal("");
  const [slug, setSlug] = createSignal("");
  const [summary, setSummary] = createSignal("");
  const [themeStatus, setThemeStatus] = createSignal<"ongoing" | "completed">(
    "ongoing",
  );
  const [problem, setProblem] = createSignal("");
  const [significance, setSignificance] = createSignal("");
  const [objectives, setObjectives] = createSignal("");
  const [approach, setApproach] = createSignal("");
  const [findings, setFindings] = createSignal("");
  const [limitations, setLimitations] = createSignal("");
  const [futureWork, setFutureWork] = createSignal("");
  const [tags, setTags] = createSignal("");
  const [seoTitle, setSeoTitle] = createSignal("");
  const [seoDescription, setSeoDescription] = createSignal("");
  const [sortOrder, setSortOrder] = createSignal("0");
  const [featuredOnHome, setFeaturedOnHome] = createSignal(false);
  const [linkLabel, setLinkLabel] = createSignal("");
  const [publishStatus, setPublishStatus] = createSignal("draft");
  const [publishedAt, setPublishedAt] = createSignal<string | null>(null);
  const [scheduledAt, setScheduledAt] = createSignal<string | null>(null);
  const [scheduleInput, setScheduleInput] = createSignal("");
  const [dirty, setDirty] = createSignal(false);
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [revisionReloadKey, setRevisionReloadKey] = createSignal(0);
  const [coverMediaId, setCoverMediaId] = createSignal<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = createSignal<string | null>(
    null,
  );
  const [coverPreviewAlt, setCoverPreviewAlt] = createSignal<string | null>(
    null,
  );
  const [coverPickerOpen, setCoverPickerOpen] = createSignal(false);
  const [collaborators, setCollaborators] = createSignal<CollaboratorRow[]>([]);
  const [acknowledgments, setAcknowledgments] = createSignal("");
  const [funding, setFunding] = createSignal("");
  const [resources, setResources] = createSignal<ThemeResourceRow[]>([]);
  const [publicationLinks, setPublicationLinks] = createSignal<
    ResearchThemePublicationLink[]
  >([]);
  const [publicationsDirty, setPublicationsDirty] = createSignal(false);
  const [publicationsSavePending, setPublicationsSavePending] =
    createSignal(false);
  const [publicationsMessage, setPublicationsMessage] = createSignal<
    string | null
  >(null);
  const [projectLinks, setProjectLinks] = createSignal<ResearchThemeProjectLink[]>(
    [],
  );
  const [projectsDirty, setProjectsDirty] = createSignal(false);
  const [projectsSavePending, setProjectsSavePending] = createSignal(false);
  const [projectsMessage, setProjectsMessage] = createSignal<string | null>(
    null,
  );
  const [publishDialogOpen, setPublishDialogOpen] = createSignal(false);
  const [publishChecklist, setPublishChecklist] =
    createSignal<ResearchPublishChecklist | null>(null);
  const [publishFlowPending, setPublishFlowPending] = createSignal(false);
  const [publishFlowError, setPublishFlowError] = createSignal<string | null>(
    null,
  );

  useUnsavedChanges(dirty);

  async function executePublish(confirmWarnings: boolean) {
    setPublishFlowPending(true);
    setPublishFlowError(null);
    const fd = new FormData();
    if (confirmWarnings) fd.set("confirmWarnings", "true");
    const result = await runPublish(themeId(), fd);
    setPublishFlowPending(false);
    if (result?.ok) {
      setPublishDialogOpen(false);
      setDirty(false);
      void reloadTheme();
      setRevisionReloadKey((k) => k + 1);
      return;
    }
    if (result && !result.ok) {
      setPublishFlowError(result.formMessage);
    }
  }

  async function handlePublishClick() {
    if (dirty()) {
      window.alert("Save your changes before publishing.");
      return;
    }
    setPublishFlowError(null);
    setPublishFlowPending(true);
    try {
      const check = await adminResearchApi.getPublishCheck(themeId());
      if (check.errors.length > 0 || check.warnings.length > 0) {
        setPublishChecklist(check);
        setPublishDialogOpen(true);
        return;
      }
      await executePublish(false);
    } catch (error) {
      setPublishFlowError(getApiErrorMessage(error));
    } finally {
      setPublishFlowPending(false);
    }
  }

  async function syncCoverPreview(mediaId: string | null) {
    setCoverMediaId(mediaId);
    if (!mediaId) {
      setCoverPreviewUrl(null);
      setCoverPreviewAlt(null);
      return;
    }
    try {
      const media = await adminMediaApi.get(mediaId);
      setCoverPreviewUrl(media.url);
      setCoverPreviewAlt(media.alt);
    } catch {
      setCoverPreviewUrl(null);
      setCoverPreviewAlt(null);
    }
  }

  function applyTheme(theme: ResearchThemeAdmin) {
    setTitle(theme.title);
    setSlug(theme.slug);
    setSummary(theme.summary);
    setThemeStatus(theme.themeStatus);
    setProblem(theme.problem);
    setSignificance(theme.significance ?? "");
    setObjectives(theme.objectives ?? "");
    setApproach(theme.approach ?? "");
    setFindings(theme.findings ?? "");
    setLimitations(theme.limitations ?? "");
    setFutureWork(theme.futureWork ?? "");
    setTags(tagsToInput(theme.tags));
    setSeoTitle(theme.seoTitle ?? "");
    setSeoDescription(theme.seoDescription ?? "");
    setSortOrder(String(theme.sortOrder));
    setFeaturedOnHome(theme.featuredOnHome);
    setLinkLabel(theme.linkLabel ?? "");
    setPublishStatus(theme.publishStatus);
    setPublishedAt(theme.publishedAt);
    setScheduledAt(theme.scheduledAt);
    void syncCoverPreview(theme.coverMediaId);
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
  }

  async function reloadPublications() {
    if (themeId() === "new") return;
    const links = await adminResearchApi.getPublications(themeId());
    setPublicationLinks(links);
    setPublicationsDirty(false);
  }

  async function reloadProjects() {
    if (themeId() === "new") return;
    const links = await adminResearchApi.getProjects(themeId());
    setProjectLinks(links);
    setProjectsDirty(false);
  }

  async function reloadTheme() {
    if (themeId() === "new") return;
    const theme = await adminResearchApi.get(themeId());
    applyTheme(theme);
    await Promise.all([reloadPublications(), reloadProjects()]);
  }

  async function saveProjects() {
    setProjectsSavePending(true);
    setProjectsMessage(null);
    try {
      const saved = await adminResearchApi.putProjects(themeId(), {
        projectIds: projectLinks().map((l) => l.id),
      });
      setProjectLinks(saved);
      setProjectsDirty(false);
      setProjectsMessage("Projects saved.");
    } catch (error) {
      setProjectsMessage(getApiErrorMessage(error));
    } finally {
      setProjectsSavePending(false);
    }
  }

  async function savePublications() {
    setPublicationsSavePending(true);
    setPublicationsMessage(null);
    try {
      const saved = await adminResearchApi.putPublications(themeId(), {
        publicationIds: publicationLinks().map((l) => l.id),
      });
      setPublicationLinks(saved);
      setPublicationsDirty(false);
      setPublicationsMessage("Publications saved.");
    } catch (error) {
      setPublicationsMessage(getApiErrorMessage(error));
    } finally {
      setPublicationsSavePending(false);
    }
  }

  const activeResult = () => {
    const results = [
      publishSubmission.result,
      unpublishSubmission.result,
      archiveSubmission.result,
      scheduleSubmission.result,
      saveSubmission.result,
    ] as (FormActionResult | undefined)[];
    for (const result of results) {
      if (result && !result.ok) return result;
    }
    return saveSubmission.result as FormActionResult | undefined;
  };

  const fieldErrors = () => resultFieldErrors(activeResult());
  const formMessage = () => {
    const fromResult = resultMessage(activeResult());
    if (fromResult) return fromResult;
    if (publishSubmission.error) return publishSubmission.error.message;
    if (unpublishSubmission.error) return unpublishSubmission.error.message;
    if (archiveSubmission.error) return archiveSubmission.error.message;
    if (scheduleSubmission.error) return scheduleSubmission.error.message;
    if (saveSubmission.error) return saveSubmission.error.message;
    return null;
  };

  const lifecyclePending = () =>
    publishSubmission.pending ||
    publishFlowPending() ||
    unpublishSubmission.pending ||
    archiveSubmission.pending ||
    scheduleSubmission.pending;

  onMount(async () => {
    if (themeId() === "new") {
      navigate("/admin/research/new", { replace: true });
      return;
    }
    try {
      applyTheme(await adminResearchApi.get(themeId()));
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        setNotFound(true);
        return;
      }
      setLoadError(getApiErrorMessage(error));
    }
  });

  createEffect(() => {
    const results = [
      saveSubmission.result,
      publishSubmission.result,
      unpublishSubmission.result,
      archiveSubmission.result,
      scheduleSubmission.result,
    ] as (FormActionResult | undefined)[];
    if (results.some((r) => r?.ok)) {
      setDirty(false);
      void reloadTheme();
      setRevisionReloadKey((k) => k + 1);
    }
  });

  function markDirty() {
    setDirty(true);
  }

  const pageTitle = () => "Edit research theme";

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
      <div>
        <Title>{pageTitle()} — SIAM Admin</Title>
        <AdminPageHeader title={pageTitle()}>
          <A
            href={`/admin/research/${themeId()}`}
            class="siam-btn-secondary no-underline"
          >
            View theme
          </A>
        </AdminPageHeader>
        <Show when={loadError()}>
          <FormErrorAlert message={loadError()} />
        </Show>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <PublishStatusBadge status={publishStatus()} />
          <Show when={publishedAt()}>
            <span class="text-sm text-ink-muted">
              Published {new Date(publishedAt()!).toLocaleString()}
            </span>
          </Show>
          <Show when={scheduledAt()}>
            <span class="text-sm text-ink-muted">
              Scheduled {new Date(scheduledAt()!).toLocaleString()}
            </span>
          </Show>
        </div>
        <FormErrorAlert message={formMessage() ?? publishFlowError()} />
        <form
          class="mt-6 max-w-2xl space-y-8"
          action={saveResearchThemeAction.with(themeId())}
          method="post"
          onInput={markDirty}
        >
          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">Identity</legend>
            <FormField label="Title" name="title" error={fieldErrors().title}>
              <FormTextInput
                name="title"
                value={title()}
                onInput={(e) => setTitle(e.currentTarget.value)}
                error={fieldErrors().title}
              />
            </FormField>
            <FormField label="Slug" name="slug" error={fieldErrors().slug}>
              <FormTextInput
                name="slug"
                value={slug()}
                onInput={(e) => setSlug(e.currentTarget.value)}
                error={fieldErrors().slug}
              />
            </FormField>
            <FormField
              label="Summary"
              name="summary"
              error={fieldErrors().summary}
            >
              <FormTextarea
                name="summary"
                rows={3}
                value={summary()}
                onInput={(e) => setSummary(e.currentTarget.value)}
                error={fieldErrors().summary}
              />
            </FormField>
          </fieldset>

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">Theme status</legend>
            <FormField label="Status" name="themeStatus">
              <select
                name="themeStatus"
                class="siam-input w-full"
                value={themeStatus()}
                onChange={(e) =>
                  setThemeStatus(
                    e.currentTarget.value === "completed"
                      ? "completed"
                      : "ongoing",
                  )
                }
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </FormField>
          </fieldset>

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">Narrative</legend>
            <FormField label="Problem" name="problem">
              <FormTextarea
                name="problem"
                rows={4}
                value={problem()}
                onInput={(e) => setProblem(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="Significance" name="significance">
              <FormTextarea
                name="significance"
                rows={4}
                value={significance()}
                onInput={(e) => setSignificance(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="Objectives" name="objectives">
              <FormTextarea
                name="objectives"
                rows={4}
                value={objectives()}
                onInput={(e) => setObjectives(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="Approach" name="approach">
              <FormTextarea
                name="approach"
                rows={4}
                value={approach()}
                onInput={(e) => setApproach(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="Findings" name="findings">
              <FormTextarea
                name="findings"
                rows={4}
                value={findings()}
                onInput={(e) => setFindings(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="Limitations" name="limitations">
              <FormTextarea
                name="limitations"
                rows={4}
                value={limitations()}
                onInput={(e) => setLimitations(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="Future work" name="futureWork">
              <FormTextarea
                name="futureWork"
                rows={4}
                value={futureWork()}
                onInput={(e) => setFutureWork(e.currentTarget.value)}
              />
            </FormField>
          </fieldset>

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">
              People and support
            </legend>
            <FormField label="Collaborators" name="collaborators">
              <CollaboratorsEditor
                rows={collaborators()}
                onChange={setCollaborators}
                onDirty={markDirty}
              />
            </FormField>
            <input
              type="hidden"
              name="collaboratorsJson"
              value={JSON.stringify(collaborators())}
            />
            <FormField label="Acknowledgments" name="acknowledgments">
              <FormTextarea
                name="acknowledgments"
                rows={3}
                value={acknowledgments()}
                onInput={(e) => setAcknowledgments(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="Funding" name="funding">
              <FormTextarea
                name="funding"
                rows={3}
                value={funding()}
                onInput={(e) => setFunding(e.currentTarget.value)}
              />
            </FormField>
          </fieldset>

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">
              Related publications
            </legend>
            <p class="text-sm text-ink-muted">
              Link published papers in display order (saved separately from the
              main form).
            </p>
            <ThemePublicationsEditor
              links={publicationLinks()}
              onChange={setPublicationLinks}
              onDirty={() => setPublicationsDirty(true)}
            />
            <div class="flex flex-wrap items-center gap-3">
              <button
                type="button"
                class="siam-btn-primary"
                disabled={
                  !publicationsDirty() || publicationsSavePending()
                }
                onClick={() => void savePublications()}
              >
                {publicationsSavePending()
                  ? "Saving…"
                  : "Save publications"}
              </button>
              <Show when={publicationsMessage()}>
                <span class="text-sm text-ink-muted">{publicationsMessage()}</span>
              </Show>
            </div>
          </fieldset>

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">
              Related projects
            </legend>
            <p class="text-sm text-ink-muted">
              Link published projects in display order (saved separately from
              the main form).
            </p>
            <ThemeProjectsEditor
              links={projectLinks()}
              onChange={setProjectLinks}
              onDirty={() => setProjectsDirty(true)}
            />
            <div class="flex flex-wrap items-center gap-3">
              <button
                type="button"
                class="siam-btn-primary"
                disabled={!projectsDirty() || projectsSavePending()}
                onClick={() => void saveProjects()}
              >
                {projectsSavePending() ? "Saving…" : "Save projects"}
              </button>
              <Show when={projectsMessage()}>
                <span class="text-sm text-ink-muted">{projectsMessage()}</span>
              </Show>
            </div>
          </fieldset>

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">Resources</legend>
            <p class="text-sm text-ink-muted">
              External links (HTTPS only). Order matches list position.
            </p>
            <ThemeResourcesEditor
              rows={resources()}
              onChange={setResources}
              onDirty={markDirty}
            />
            <input
              type="hidden"
              name="resourcesJson"
              value={JSON.stringify(resources())}
            />
          </fieldset>

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">Tags</legend>
            <FormField
              label="Methods / domains (comma-separated)"
              name="tags"
              error={fieldErrors().tags}
            >
              <FormTextInput
                name="tags"
                value={tags()}
                onInput={(e) => setTags(e.currentTarget.value)}
                error={fieldErrors().tags}
              />
            </FormField>
          </fieldset>

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">SEO</legend>
            <FormField label="SEO title (optional)" name="seoTitle">
              <FormTextInput
                name="seoTitle"
                value={seoTitle()}
                onInput={(e) => setSeoTitle(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="SEO description (optional)" name="seoDescription">
              <FormTextarea
                name="seoDescription"
                rows={2}
                value={seoDescription()}
                onInput={(e) => setSeoDescription(e.currentTarget.value)}
              />
            </FormField>
          </fieldset>

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">Cover</legend>
            <Show when={coverPreviewUrl()}>
              <img
                src={coverPreviewUrl()!}
                alt={coverPreviewAlt() ?? ""}
                class="max-h-40 w-full max-w-md rounded-lg object-cover"
              />
            </Show>
            <Show
              when={coverMediaId() && !coverPreviewAlt()?.trim()}
            >
              <p class="text-sm text-ink-muted">
                Add alt text in the{" "}
                <A href="/admin/media" class="text-link">
                  Media library
                </A>{" "}
                for accessibility.
              </p>
            </Show>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="siam-btn-secondary text-sm"
                onClick={() => setCoverPickerOpen(true)}
              >
                Choose from library
              </button>
              <Show when={coverMediaId()}>
                <button
                  type="button"
                  class="siam-btn-secondary text-sm"
                  onClick={() => {
                    void syncCoverPreview(null);
                    markDirty();
                  }}
                >
                  Clear cover
                </button>
              </Show>
            </div>
            <input
              type="hidden"
              name="coverMediaId"
              value={coverMediaId() ?? ""}
            />
          </fieldset>
          <MediaPicker
            open={coverPickerOpen()}
            imagesOnly
            onClose={() => setCoverPickerOpen(false)}
            onSelect={(selection: MediaPickerSelection) => {
              void syncCoverPreview(selection.id);
              setCoverPreviewUrl(selection.url);
              setCoverPreviewAlt(selection.alt ?? null);
              setCoverPickerOpen(false);
              markDirty();
            }}
          />

          <fieldset class="space-y-4 border-0 p-0">
            <legend class="text-lg font-semibold text-ink">Display</legend>
            <FormField label="Sort order" name="sortOrder">
              <FormTextInput
                name="sortOrder"
                type="number"
                value={sortOrder()}
                onInput={(e) => setSortOrder(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="Featured on home" name="featuredOnHome">
              <label class="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="featuredOnHome"
                  checked={featuredOnHome()}
                  onChange={(e) => setFeaturedOnHome(e.currentTarget.checked)}
                />
                Show in home research focus when published
              </label>
            </FormField>
            <FormField label="Card link label (optional)" name="linkLabel">
              <FormTextInput
                name="linkLabel"
                value={linkLabel()}
                onInput={(e) => setLinkLabel(e.currentTarget.value)}
              />
            </FormField>
          </fieldset>

          <Show when={themeId() !== "new"}>
            <fieldset class="space-y-3 border-0 p-0">
              <legend class="text-lg font-semibold text-ink">Publishing</legend>
              <div class="flex flex-wrap gap-2">
                <A
                  href={`/admin/research/${themeId()}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="siam-btn-secondary no-underline"
                >
                  Preview
                </A>
                <Show
                  when={
                    publishStatus() === "draft" || publishStatus() === "scheduled"
                  }
                >
                  <button
                    type="button"
                    class="siam-btn-secondary"
                    disabled={saveSubmission.pending || lifecyclePending()}
                    onClick={() => void handlePublishClick()}
                  >
                    {publishFlowPending() || publishSubmission.pending
                      ? "Publishing…"
                      : "Publish"}
                  </button>
                </Show>
                <Show
                  when={
                    publishStatus() === "published" ||
                    publishStatus() === "scheduled"
                  }
                >
                  <button
                    type="submit"
                    class="siam-btn-secondary"
                    formaction={unpublishResearchThemeAction.with(themeId())}
                    disabled={saveSubmission.pending || lifecyclePending()}
                  >
                    {unpublishSubmission.pending ? "Unpublishing…" : "Unpublish"}
                  </button>
                </Show>
                <Show when={publishStatus() !== "archived"}>
                  <button
                    type="submit"
                    class="siam-btn-secondary"
                    formaction={archiveResearchThemeAction.with(themeId())}
                    disabled={saveSubmission.pending || lifecyclePending()}
                  >
                    {archiveSubmission.pending ? "Archiving…" : "Archive"}
                  </button>
                </Show>
              </div>
              <Show when={publishStatus() === "draft"}>
                <div class="flex flex-wrap items-end gap-2">
                  <label class="flex flex-col gap-1 text-sm">
                    <span class="text-ink-muted">Schedule publish</span>
                    <input
                      type="datetime-local"
                      name="scheduledAt"
                      class="siam-input"
                      value={scheduleInput()}
                      onInput={(e) => setScheduleInput(e.currentTarget.value)}
                    />
                  </label>
                  <button
                    type="submit"
                    class="siam-btn-secondary"
                    formaction={scheduleResearchThemeAction.with(themeId())}
                    disabled={saveSubmission.pending || lifecyclePending()}
                  >
                    {scheduleSubmission.pending ? "Scheduling…" : "Schedule"}
                  </button>
                </div>
              </Show>
            </fieldset>
          </Show>

          <Show when={themeId() !== "new"}>
            <ResearchRevisionsPanel
              themeId={themeId()}
              reloadKey={revisionReloadKey()}
              onRestored={(theme) => {
                applyTheme(theme);
                setDirty(false);
              }}
              onRestoredComplete={() => setRevisionReloadKey((k) => k + 1)}
            />
          </Show>

          <div class="flex flex-wrap gap-2">
            <button
              type="submit"
              class="siam-btn-primary"
              disabled={saveSubmission.pending || lifecyclePending()}
            >
              {saveSubmission.pending ? "Saving…" : "Save"}
            </button>
            <A href="/admin/research" class="siam-btn-secondary no-underline">
              Back to list
            </A>
          </div>
        </form>
        <ResearchPublishChecklistDialog
          open={publishDialogOpen()}
          checklist={publishChecklist()}
          pending={publishFlowPending()}
          onClose={() => setPublishDialogOpen(false)}
          onPublishAnyway={() => void executePublish(true)}
        />
      </div>
    </Show>
  );
}
