import { createResource } from "solid-js";
import { A } from "@solidjs/router";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminClient } from "~/lib/api";

interface DashboardCounts {
  pages: { draft: number; published: number; scheduled: number; archived: number };
  media: number;
}

export default function AdminHome() {
  const countsResource = createResource(() =>
    adminClient.get<DashboardCounts>("/dashboard"),
  );

  return (
    <ResourceRequest resource={countsResource}>
      {(counts) => (
        <div>
          <h1 class="text-2xl font-bold text-ink">Dashboard</h1>
          <p class="mt-2 text-ink-muted">CMS overview</p>
          <dl class="mt-8 grid gap-4 sm:grid-cols-2">
            <div class="siam-card p-4">
              <dt class="text-sm text-ink-muted">Published pages</dt>
              <dd class="text-2xl font-semibold">{counts.pages.published}</dd>
            </div>
            <div class="siam-card p-4">
              <dt class="text-sm text-ink-muted">Draft pages</dt>
              <dd class="text-2xl font-semibold">{counts.pages.draft}</dd>
            </div>
          </dl>
          <div class="mt-8 flex gap-3">
            <A href="/admin/pages" class="siam-btn-primary no-underline">Manage pages</A>
          </div>
          <div class="mt-8 max-w-lg">
            <EmptyState
              title="More modules coming"
              description="Publications, media library, and profile editors ship in later phases."
            />
          </div>
        </div>
      )}
    </ResourceRequest>
  );
}
