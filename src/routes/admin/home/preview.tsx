import { A } from "@solidjs/router";
import { Meta, Title } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import LandingPage from "~/components/landing/LandingPage";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { homeContent } from "~/content";
import { adminHomeApi } from "~/lib/api/endpoints/admin/home.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import { mapPublicHomeToContent } from "~/lib/api/public/mapPublicHomeToContent";
import type { PublicHomePayload } from "~/lib/api/endpoints/public/site.api";

export default function AdminHomePreview() {
  const [payload, setPayload] = createSignal<PublicHomePayload | null>(null);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      setPayload(await adminHomeApi.preview());
    } catch (e) {
      setLoadError(getApiErrorMessage(e));
    }
  });

  const content = () =>
    mapPublicHomeToContent(payload() ?? undefined, homeContent, {
      treatAsPublished: true,
    });

  return (
    <div>
      <Title>Home preview — SIAM Admin</Title>
      <Meta name="robots" content="noindex" />

      <div
        class="mb-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted"
        role="status"
      >
        Preview — draft homepage composition. Visitors see this only after you
        publish the homepage.{" "}
        <A href="/admin/home" class="text-primary no-underline hover:underline">
          Back to editor
        </A>
      </div>

      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>

      <Show
        when={payload()}
        fallback={
          <Show when={!loadError() && !payload()}>
            <EmptyState variant="list" title="Loading preview…" />
          </Show>
        }
      >
        <LandingPage content={content()} />
      </Show>
    </div>
  );
}
