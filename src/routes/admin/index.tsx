import { createResource } from "solid-js";
import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import ResourceRequest from "~/components/ResourceRequest";
import { adminClient } from "~/lib/api";
import type { DashboardCounts } from "~/lib/api/types/admin.types";

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
          <dl class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="siam-card p-4">
              <dt class="text-sm text-ink-muted">Published pages</dt>
              <dd class="text-2xl font-semibold">{counts.pages.published}</dd>
            </div>
            <div class="siam-card p-4">
              <dt class="text-sm text-ink-muted">Draft pages</dt>
              <dd class="text-2xl font-semibold">{counts.pages.draft}</dd>
            </div>
            <A
              href="/admin/publications"
              class="siam-card block p-4 no-underline transition-colors hover:border-primary"
            >
              <dt class="text-sm text-ink-muted">Published publications</dt>
              <dd class="text-2xl font-semibold text-ink">
                {counts.publications.published}
              </dd>
              <p class="mt-1 text-xs text-ink-muted">
                {counts.publications.draft} draft
              </p>
            </A>
            <A
              href="/admin/projects"
              class="siam-card block p-4 no-underline transition-colors hover:border-primary"
            >
              <dt class="text-sm text-ink-muted">Published projects</dt>
              <dd class="text-2xl font-semibold text-ink">
                {counts.projects.published}
              </dd>
              <p class="mt-1 text-xs text-ink-muted">
                {counts.projects.draft} draft
              </p>
            </A>
            <A
              href="/admin/writing"
              class="siam-card block p-4 no-underline transition-colors hover:border-primary"
            >
              <dt class="text-sm text-ink-muted">Published articles</dt>
              <dd class="text-2xl font-semibold text-ink">
                {counts.writing.published}
              </dd>
              <p class="mt-1 text-xs text-ink-muted">
                {counts.writing.draft} draft
              </p>
            </A>
            <A
              href="/admin/achievements"
              class="siam-card block p-4 no-underline transition-colors hover:border-primary"
            >
              <dt class="text-sm text-ink-muted">Published timeline entries</dt>
              <dd class="text-2xl font-semibold text-ink">
                {counts.timeline.published}
              </dd>
              <p class="mt-1 text-xs text-ink-muted">
                {counts.timeline.draft} draft
              </p>
            </A>
            <A
              href="/admin/messages?status=new"
              class={`siam-card block p-4 no-underline transition-colors hover:border-primary ${counts.inbox.formEnabled ? "" : "opacity-80"}`}
            >
              <dt class="text-sm text-ink-muted">Unread messages</dt>
              <dd class="text-2xl font-semibold text-ink">
                {counts.inbox.unread}
              </dd>
              <p class="mt-1 text-xs text-ink-muted">
                {counts.inbox.new} new
                {!counts.inbox.formEnabled ? " · Contact form is off" : ""}
              </p>
            </A>
            <A href="/admin/media" class="siam-card block p-4 no-underline transition-colors hover:border-primary">
              <dt class="text-sm text-ink-muted">Media files</dt>
              <dd class="text-2xl font-semibold text-ink">{counts.media}</dd>
            </A>
          </dl>
          <div class="mt-8 flex flex-wrap gap-3">
            <A href="/admin/pages" class="siam-btn-primary no-underline">Manage pages</A>
            <A href="/admin/publications" class="siam-btn-secondary no-underline">
              Publications
            </A>
            <A href="/admin/projects" class="siam-btn-secondary no-underline">
              Projects
            </A>
            <A href="/admin/writing" class="siam-btn-secondary no-underline">
              Writing
            </A>
            <A href="/admin/achievements" class="siam-btn-secondary no-underline">
              Achievements & timeline
            </A>
            <A href="/admin/messages" class="siam-btn-secondary no-underline">
              Messages
            </A>
            <A href="/admin/media" class="siam-btn-secondary no-underline">Media library</A>
          </div>
        </div>
      )}
    </ResourceRequest>
  );
}
