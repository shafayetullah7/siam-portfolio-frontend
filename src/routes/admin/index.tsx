import { createResource } from "solid-js";
import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
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
          <Title>Dashboard — SIAM Admin</Title>
          <AdminPageHeader title="Dashboard" description="CMS overview" />
          <dl class="mt-8 grid gap-4 sm:grid-cols-3">
            <div class="siam-card p-4">
              <dt class="text-sm text-ink-muted">Published pages</dt>
              <dd class="text-2xl font-semibold">{counts.pages.published}</dd>
            </div>
            <div class="siam-card p-4">
              <dt class="text-sm text-ink-muted">Draft pages</dt>
              <dd class="text-2xl font-semibold">{counts.pages.draft}</dd>
            </div>
            <A href="/admin/media" class="siam-card block p-4 no-underline transition-colors hover:border-primary">
              <dt class="text-sm text-ink-muted">Media files</dt>
              <dd class="text-2xl font-semibold text-ink">{counts.media}</dd>
            </A>
          </dl>
          <div class="mt-8 flex flex-wrap gap-3">
            <A href="/admin/pages" class="siam-btn-primary no-underline">Manage pages</A>
            <A href="/admin/media" class="siam-btn-secondary no-underline">Media library</A>
          </div>
        </div>
      )}
    </ResourceRequest>
  );
}
