import { A } from "@solidjs/router";
import { createSignal, Show, type JSX } from "solid-js";
import CollaboratorsEditor, {
  type CollaboratorRow,
} from "~/components/admin/research/CollaboratorsEditor";
import ThemeProjectsEditor from "~/components/admin/research/ThemeProjectsEditor";
import ThemePublicationsEditor from "~/components/admin/research/ThemePublicationsEditor";
import ThemeResourcesEditor, {
  type ThemeResourceRow,
} from "~/components/admin/research/ThemeResourcesEditor";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type {
  ResearchThemeProjectLink,
  ResearchThemePublicationLink,
} from "~/lib/api/types/research.types";

function ExtrasSection(props: {
  title: string;
  description?: string;
  children: JSX.Element;
  footer?: JSX.Element;
}) {
  return (
    <section
      class="rounded-xl border border-border bg-surface-container-lowest/60 p-4 sm:p-5"
    >
      <div class="mb-4">
        <h3 class="text-base font-semibold text-ink">{props.title}</h3>
        <Show when={props.description}>
          <p class="mt-1 text-sm text-ink-muted">{props.description}</p>
        </Show>
      </div>
      {props.children}
      <Show when={props.footer}>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          {props.footer}
        </div>
      </Show>
    </section>
  );
}

export type ResearchThemeEditExtrasProps = {
  themeId: string;
  formMessage?: string | null;
  collaborators: CollaboratorRow[];
  acknowledgments: string;
  funding: string;
  resources: ThemeResourceRow[];
  seoTitle: string;
  seoDescription: string;
  sortOrder: string;
  featuredOnHome: boolean;
  linkLabel: string;
  publicationLinks: ResearchThemePublicationLink[];
  projectLinks: ResearchThemeProjectLink[];
  onCollaboratorsChange: (rows: CollaboratorRow[]) => void;
  onAcknowledgmentsChange: (value: string) => void;
  onFundingChange: (value: string) => void;
  onResourcesChange: (rows: ThemeResourceRow[]) => void;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
  onFeaturedOnHomeChange: (value: boolean) => void;
  onLinkLabelChange: (value: string) => void;
  onPublicationLinksChange: (links: ResearchThemePublicationLink[]) => void;
  onProjectLinksChange: (links: ResearchThemeProjectLink[]) => void;
  onDirty: () => void;
};

export default function ResearchThemeEditExtras(props: ResearchThemeEditExtrasProps) {
  const [publicationsDirty, setPublicationsDirty] = createSignal(false);
  const [publicationsSavePending, setPublicationsSavePending] = createSignal(false);
  const [publicationsMessage, setPublicationsMessage] = createSignal<string | null>(
    null,
  );
  const [projectsDirty, setProjectsDirty] = createSignal(false);
  const [projectsSavePending, setProjectsSavePending] = createSignal(false);
  const [projectsMessage, setProjectsMessage] = createSignal<string | null>(null);

  async function savePublications() {
    setPublicationsSavePending(true);
    setPublicationsMessage(null);
    try {
      const saved = await adminResearchApi.putPublications(props.themeId, {
        publicationIds: props.publicationLinks.map((l) => l.id),
      });
      props.onPublicationLinksChange(saved);
      setPublicationsDirty(false);
      setPublicationsMessage("Saved.");
    } catch (error) {
      setPublicationsMessage(getApiErrorMessage(error));
    } finally {
      setPublicationsSavePending(false);
    }
  }

  async function saveProjects() {
    setProjectsSavePending(true);
    setProjectsMessage(null);
    try {
      const saved = await adminResearchApi.putProjects(props.themeId, {
        projectIds: props.projectLinks.map((l) => l.id),
      });
      props.onProjectLinksChange(saved);
      setProjectsDirty(false);
      setProjectsMessage("Saved.");
    } catch (error) {
      setProjectsMessage(getApiErrorMessage(error));
    } finally {
      setProjectsSavePending(false);
    }
  }

  return (
    <div class="siam-card min-w-0 space-y-6 p-6">
      <div>
        <p class="siam-eyebrow text-secondary">Step 4</p>
        <h2 class="text-lg font-semibold text-ink">More</h2>
        <p class="mt-1 text-sm text-ink-muted">
          Optional people, links, and display. Theme fields save with{" "}
          <strong class="font-medium text-ink">Save changes</strong> below;
          publication and project lists save separately when you update them.
        </p>
      </div>
      <FormErrorAlert message={props.formMessage ?? null} />

      <ExtrasSection
        title="People and support"
        description="Credits and funding notes shown on the public theme page when set."
      >
        <div class="space-y-4">
          <FormField label="Collaborators" name="collaborators">
            <CollaboratorsEditor
              rows={props.collaborators}
              onChange={props.onCollaboratorsChange}
              onDirty={props.onDirty}
            />
          </FormField>
          <input
            type="hidden"
            name="collaboratorsJson"
            value={JSON.stringify(props.collaborators)}
          />
          <FormField label="Acknowledgments" name="acknowledgments">
            <FormTextarea
              name="acknowledgments"
              rows={3}
              value={props.acknowledgments}
              onInput={(e) => {
                props.onDirty();
                props.onAcknowledgmentsChange(e.currentTarget.value);
              }}
            />
          </FormField>
          <FormField label="Funding" name="funding">
            <FormTextarea
              name="funding"
              rows={3}
              value={props.funding}
              onInput={(e) => {
                props.onDirty();
                props.onFundingChange(e.currentTarget.value);
              }}
            />
          </FormField>
        </div>
      </ExtrasSection>

      <ExtrasSection
        title="Related publications"
        description="Order matches how they appear on the public theme. Draft papers can be linked but may warn at publish."
        footer={
          <>
            <span class="text-xs text-ink-muted sm:max-w-[50%]">
              <Show
                when={publicationsDirty()}
                fallback="Add or reorder, then save this list."
              >
                Unsaved changes to publication links
              </Show>
            </span>
            <div class="flex flex-wrap items-center gap-2">
              <Show when={publicationsMessage()}>
                <span
                  classList={{
                    "text-sm": true,
                    "text-ink-muted": publicationsMessage() === "Saved.",
                    "text-error": publicationsMessage() !== "Saved.",
                  }}
                >
                  {publicationsMessage()}
                </span>
              </Show>
              <button
                type="button"
                class="siam-btn-primary text-sm"
                disabled={!publicationsDirty() || publicationsSavePending()}
                onClick={() => void savePublications()}
              >
                {publicationsSavePending() ? "Saving…" : "Save publications"}
              </button>
            </div>
          </>
        }
      >
        <Show when={props.publicationLinks.length === 0}>
          <p class="mb-3 text-sm text-ink-muted">
            No publications linked yet.
          </p>
        </Show>
        <ThemePublicationsEditor
          links={props.publicationLinks}
          onChange={props.onPublicationLinksChange}
          onDirty={() => setPublicationsDirty(true)}
        />
      </ExtrasSection>

      <ExtrasSection
        title="Related projects"
        description="Published projects only appear on the public site when the project itself is published."
        footer={
          <>
            <span class="text-xs text-ink-muted sm:max-w-[50%]">
              <Show
                when={projectsDirty()}
                fallback="Add or reorder, then save this list."
              >
                Unsaved changes to project links
              </Show>
            </span>
            <div class="flex flex-wrap items-center gap-2">
              <Show when={projectsMessage()}>
                <span
                  classList={{
                    "text-sm": true,
                    "text-ink-muted": projectsMessage() === "Saved.",
                    "text-error": projectsMessage() !== "Saved.",
                  }}
                >
                  {projectsMessage()}
                </span>
              </Show>
              <button
                type="button"
                class="siam-btn-primary text-sm"
                disabled={!projectsDirty() || projectsSavePending()}
                onClick={() => void saveProjects()}
              >
                {projectsSavePending() ? "Saving…" : "Save projects"}
              </button>
            </div>
          </>
        }
      >
        <Show when={props.projectLinks.length === 0}>
          <p class="mb-3 text-sm text-ink-muted">No projects linked yet.</p>
        </Show>
        <ThemeProjectsEditor
          links={props.projectLinks}
          onChange={props.onProjectLinksChange}
          onDirty={() => setProjectsDirty(true)}
        />
      </ExtrasSection>

      <ExtrasSection
        title="Resources"
        description="External HTTPS links (code, data, demos). Included when you save theme changes."
      >
        <ThemeResourcesEditor
          rows={props.resources}
          onChange={props.onResourcesChange}
          onDirty={props.onDirty}
        />
        <input
          type="hidden"
          name="resourcesJson"
          value={JSON.stringify(props.resources)}
        />
      </ExtrasSection>

      <ExtrasSection
        title="SEO & display"
        description="Search and hub placement. Saved with Save changes."
      >
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="space-y-4 lg:col-span-2">
            <FormField label="SEO title (optional)" name="seoTitle">
              <FormTextInput
                name="seoTitle"
                value={props.seoTitle}
                onInput={(e) => {
                  props.onDirty();
                  props.onSeoTitleChange(e.currentTarget.value);
                }}
              />
            </FormField>
            <FormField label="SEO description (optional)" name="seoDescription">
              <FormTextarea
                name="seoDescription"
                rows={2}
                value={props.seoDescription}
                onInput={(e) => {
                  props.onDirty();
                  props.onSeoDescriptionChange(e.currentTarget.value);
                }}
              />
            </FormField>
          </div>
          <FormField label="Sort order" name="sortOrder">
            <FormTextInput
              name="sortOrder"
              type="number"
              value={props.sortOrder}
              onInput={(e) => {
                props.onDirty();
                props.onSortOrderChange(e.currentTarget.value);
              }}
            />
          </FormField>
          <FormField label="Card link label (optional)" name="linkLabel">
            <FormTextInput
              name="linkLabel"
              value={props.linkLabel}
              onInput={(e) => {
                props.onDirty();
                props.onLinkLabelChange(e.currentTarget.value);
              }}
            />
          </FormField>
          <div class="lg:col-span-2">
            <FormField label="Featured on home" name="featuredOnHome">
              <label class="flex items-center gap-2 text-sm font-normal">
                <input
                  type="checkbox"
                  name="featuredOnHome"
                  checked={props.featuredOnHome}
                  onChange={(e) => {
                    props.onDirty();
                    props.onFeaturedOnHomeChange(e.currentTarget.checked);
                  }}
                />
                Show in home research focus when published
              </label>
            </FormField>
          </div>
        </div>
      </ExtrasSection>

      <div class="flex flex-wrap gap-2">
        <A
          href={`/admin/research/${props.themeId}/preview`}
          target="_blank"
          rel="noopener noreferrer"
          class="siam-btn-secondary no-underline text-sm"
        >
          Public preview
        </A>
      </div>

    </div>
  );
}
