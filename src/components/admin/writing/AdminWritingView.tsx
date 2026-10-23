import { A } from "@solidjs/router";
import { Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import WritingPublishControls from "~/components/admin/writing/WritingPublishControls";
import WritingRelatedPanel from "~/components/admin/writing/WritingRelatedPanel";
import type { WritingAdminDetail } from "~/lib/api/types/writing.types";

export type AdminWritingViewProps = {
  article: WritingAdminDetail;
  onArticleUpdated?: (article: WritingAdminDetail) => void;
};

function formatWhen(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AdminWritingView(props: AdminWritingViewProps) {
  const a = () => props.article;

  return (
    <div class="max-w-3xl min-w-0">
      <AdminPageHeader
        title={a().title}
        description={`/${a().slug} · ${a().readingTimeMinutes ?? "—"} min read`}
      >
        <A
          href={`/admin/writing/${a().id}/edit`}
          class="siam-btn-primary no-underline"
        >
          Edit
        </A>
        <A
          href={`/admin/writing/${a().id}/preview`}
          class="siam-btn-secondary no-underline"
        >
          Public preview
        </A>
        <WritingPublishControls
          articleId={a().id}
          publishStatus={a().publishStatus}
          variant="bar"
          onUpdated={props.onArticleUpdated}
        />
        <A href="/admin/writing" class="siam-btn-secondary no-underline">
          Back to list
        </A>
      </AdminPageHeader>

      <div
        class="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-container-lowest px-4 py-3 text-sm"
      >
        <PublishStatusBadge status={a().publishStatus} />
        <Show when={formatWhen(a().updatedAt)}>
          <span class="text-ink-muted">Updated {formatWhen(a().updatedAt)}</span>
        </Show>
        <Show when={a().tags && a().tags!.length > 0}>
          <span class="text-ink-muted">
            Tags: {a().tags!.join(", ")}
          </span>
        </Show>
      </div>

      <div class="mt-6 space-y-4">
        <div>
          <h2 class="text-sm font-medium text-ink-muted">Summary</h2>
          <p class="mt-1 whitespace-pre-wrap text-ink">{a().summary}</p>
        </div>
        <Show when={a().subtitle?.trim()}>
          <div>
            <h2 class="text-sm font-medium text-ink-muted">Subtitle</h2>
            <p class="mt-1 text-ink">{a().subtitle}</p>
          </div>
        </Show>
        <div>
          <h2 class="text-sm font-medium text-ink-muted">Body preview</h2>
          <pre class="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-surface-container-lowest p-3 font-mono text-xs text-ink">
            {(a().body || "").slice(0, 800)}
            {(a().body?.length ?? 0) > 800 ? "…" : ""}
          </pre>
        </div>
      </div>

      <WritingRelatedPanel articleId={a().id} excludeArticleId={a().id} />
    </div>
  );
}
