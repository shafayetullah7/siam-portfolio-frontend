import { A } from "@solidjs/router";
import { Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import ProjectPublishControls from "~/components/admin/projects/ProjectPublishControls";
import ProjectRelatedPublicationsPanel from "~/components/admin/projects/ProjectRelatedPublicationsPanel";
import EvaluationMaturityBadge from "~/components/projects/EvaluationMaturityBadge";
import type { ProjectAdminSummary } from "~/lib/api/types/project.types";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_LABELS,
} from "~/lib/projects/projectLabels";

export type AdminProjectViewProps = {
  project: ProjectAdminSummary;
  onProjectUpdated?: (project: ProjectAdminSummary) => void;
};

function formatWhen(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function field(label: string, value: string | null | undefined) {
  const text = value?.trim();
  if (!text) return null;
  return (
    <div>
      <dt class="text-sm text-ink-muted">{label}</dt>
      <dd class="mt-0.5 text-ink whitespace-pre-wrap">{text}</dd>
    </div>
  );
}

export default function AdminProjectView(props: AdminProjectViewProps) {
  const p = () => props.project;

  return (
    <div class="max-w-3xl min-w-0">
      <AdminPageHeader
        title={p().title}
        description={`/${p().slug} · ${PROJECT_TYPE_LABELS[p().projectType]}`}
      >
        <A
          href={`/admin/projects/${p().id}/edit`}
          class="siam-btn-primary no-underline"
        >
          Edit
        </A>
        <A
          href={`/admin/projects/${p().id}/preview`}
          class="siam-btn-secondary no-underline"
        >
          Public preview
        </A>
        <ProjectPublishControls
          projectId={p().id}
          publishStatus={p().publishStatus}
          variant="bar"
          onUpdated={props.onProjectUpdated}
        />
        <A href="/admin/projects" class="siam-btn-secondary no-underline">
          Back to list
        </A>
      </AdminPageHeader>

      <div
        class="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-container-lowest px-4 py-3 text-sm"
      >
        <PublishStatusBadge status={p().publishStatus} />
        <span class="text-ink-muted">
          Status: {PROJECT_STATUS_LABELS[p().projectStatus]}
        </span>
        <EvaluationMaturityBadge maturity={p().evaluationMaturity} />
        <Show when={p().featured}>
          <span class="text-ink-muted">Featured</span>
        </Show>
        <Show when={p().featuredOnHome}>
          <span class="text-ink-muted">Home featured</span>
        </Show>
        <Show when={formatWhen(p().updatedAt)}>
          <span class="text-ink-muted">Updated {formatWhen(p().updatedAt)}</span>
        </Show>
      </div>

      <p class="mt-4 text-sm text-ink-muted">
        When published, the public URL is{" "}
        <A href={`/projects/${p().slug}`} class="text-link font-mono no-underline">
          /projects/{p().slug}
        </A>
        .
      </p>

      <dl class="mt-8 space-y-4">
        {field("Summary", p().summary)}
        {field("Owner role", p().ownerRole)}
        {field("Contribution", p().ownerContribution)}
        {field("Result teaser", p().resultTeaser)}
        <div>
          <dt class="text-sm text-ink-muted">Case study</dt>
          <dd class="mt-0.5 text-ink">
            {p().sections.length} section(s), {p().metrics.length} metric(s),{" "}
            {p().resources.length} resource(s)
          </dd>
        </div>
        <Show when={p().tags?.length}>
          <div>
            <dt class="text-sm text-ink-muted">Tags</dt>
            <dd class="mt-0.5 text-ink">{p().tags!.join(", ")}</dd>
          </div>
        </Show>
      </dl>

      <ProjectRelatedPublicationsPanel projectId={p().id} />
    </div>
  );
}
