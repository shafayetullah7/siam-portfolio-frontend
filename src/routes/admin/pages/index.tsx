import { createResource, For } from "solid-js";
import { A } from "@solidjs/router";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminPagesApi } from "~/lib/api/endpoints/admin/pages.api";

export default function AdminPagesList() {
  const pagesResource = createResource(() => adminPagesApi.list());

  return (
    <ResourceRequest
      resource={pagesResource}
      emptyWhen={(pages) => pages.length === 0}
      emptyFallback={
        <EmptyState
          variant="list"
          title="No pages yet"
          description="Create your first site page to get started."
        >
          <A href="/admin/pages/new" class="siam-btn-primary no-underline">
            New page
          </A>
        </EmptyState>
      }
    >
      {(pages) => (
        <div>
          <div class="flex items-center justify-between gap-4">
            <h1 class="text-2xl font-bold text-ink">Site pages</h1>
            <A href="/admin/pages/new" class="siam-btn-primary no-underline">New page</A>
          </div>
          <ul class="mt-6 divide-y divide-border">
            <For each={pages}>
              {(page) => (
                <li class="flex items-center justify-between py-3">
                  <div>
                    <p class="font-medium text-ink">{page.title}</p>
                    <p class="text-sm text-ink-muted">
                      /{page.slug} · {page.publishStatus}
                    </p>
                  </div>
                  <A href={`/admin/pages/${page.id}`} class="text-link text-sm">
                    Edit
                  </A>
                </li>
              )}
            </For>
          </ul>
        </div>
      )}
    </ResourceRequest>
  );
}
