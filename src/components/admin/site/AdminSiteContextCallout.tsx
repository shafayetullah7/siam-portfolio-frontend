import { A } from "@solidjs/router";

export default function AdminSiteContextCallout() {
  return (
    <div
      class="rounded-lg border border-border bg-surface-container-low p-4 text-sm text-ink"
      role="note"
    >
      <p class="m-0 font-medium text-ink">What lives where</p>
      <ul class="mt-2 list-disc space-y-1 pl-5 text-ink-muted">
        <li>
          <A href="/admin/home" class="text-link">
            Edit home
          </A>{" "}
          — landing hero, section order, home SEO.
        </li>
        <li>
          <A href="/admin/pages" class="text-link">
            Pages
          </A>{" "}
          — custom CMS pages (use paths like{" "}
          <span class="font-mono text-xs">/pages/your-slug</span> in nav when a
          public route exists).
        </li>
        <li>
          <strong class="font-medium text-ink">This screen</strong> — site name,
          header navigation, listing-page intros, and contact page copy.
        </li>
      </ul>
    </div>
  );
}
