import { createResource, For } from "solid-js";
import { A } from "@solidjs/router";
import { adminPagesApi } from "~/lib/api/endpoints/admin/pages.api";

export default function AdminPagesList() {
  const [pages] = createResource(() => adminPagesApi.list());

  return (
    <div>
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-ink">Site pages</h1>
        <A href="/admin/pages/new" class="siam-btn-primary no-underline">New page</A>
      </div>
      <ul class="mt-6 divide-y divide-border">
        <For each={pages() ?? []}>
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
  );
}
