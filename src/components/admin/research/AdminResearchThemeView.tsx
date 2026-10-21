import { A } from "@solidjs/router";
import { Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import ResearchThemeDetailView from "~/components/research/ResearchThemeDetailView";
import type { ResearchThemeAdmin } from "~/lib/api/types/admin.types";
import type { ResearchThemeDetailPublic } from "~/lib/api/types/research.types";
import ResearchRevisionsPanel from "./ResearchRevisionsPanel";
import ResearchThemePublishControls from "./ResearchThemePublishControls";

export type AdminResearchThemeViewProps = {
  themeId: string;
  admin: ResearchThemeAdmin;
  publicDetail: ResearchThemeDetailPublic;
  onAdminUpdated?: (theme: ResearchThemeAdmin) => void;
};

function formatWhen(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AdminResearchThemeView(props: AdminResearchThemeViewProps) {
  const a = () => props.admin;

  return (
    <div class="w-full max-w-5xl">
      <AdminPageHeader title={a().title} description={a().summary}>
        <div class="flex flex-wrap gap-2">
          <A
            href={`/admin/research/${props.themeId}/edit`}
            class="siam-btn-primary no-underline"
          >
            Edit theme
          </A>
          <A
            href={`/admin/research/${props.themeId}/preview`}
            class="siam-btn-secondary no-underline"
          >
            Public preview
          </A>
          <ResearchThemePublishControls
            themeId={props.themeId}
            publishStatus={a().publishStatus}
            variant="bar"
            onUpdated={props.onAdminUpdated}
          />
          <Show when={a().publishStatus === "published"}>
            <A
              href={`/research/${a().slug}`}
              class="siam-btn-secondary no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on site
            </A>
          </Show>
        </div>
      </AdminPageHeader>

      <div
        class="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-container-lowest px-4 py-3 text-sm"
      >
        <PublishStatusBadge status={a().publishStatus} />
        <span class="text-ink-muted capitalize">Theme: {a().themeStatus}</span>
        <span class="text-ink-muted">
          Slug: <span class="font-mono text-ink">{a().slug}</span>
        </span>
        <Show when={a().featuredOnHome}>
          <span class="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Featured on home
          </span>
        </Show>
        <span class="text-ink-muted">Order: {a().sortOrder}</span>
        <Show when={formatWhen(a().updatedAt)}>
          <span class="text-ink-muted">Updated {formatWhen(a().updatedAt)}</span>
        </Show>
        <Show when={formatWhen(a().publishedAt)}>
          <span class="text-ink-muted">
            Published {formatWhen(a().publishedAt)}
          </span>
        </Show>
      </div>

      <div class="mt-10">
        <ResearchThemeDetailView
          theme={props.publicDetail}
          backHref="/admin/research"
          backLabel="All themes"
        />
      </div>

      <section
        class="mt-10 rounded-xl border border-border bg-surface-container-lowest/60 p-4 sm:p-5"
      >
        <h2 class="text-base font-semibold text-ink">Revision history</h2>
        <p class="mt-1 text-sm text-ink-muted">
          Only fields that changed on each save are stored; open a row to see those values.
        </p>
        <div class="mt-4">
          <ResearchRevisionsPanel
            themeId={props.themeId}
            reloadKey={new Date(a().updatedAt).getTime()}
          />
        </div>
      </section>
    </div>
  );
}
