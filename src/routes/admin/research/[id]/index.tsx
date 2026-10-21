import { A, useNavigate, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import AdminResearchThemeView from "~/components/admin/research/AdminResearchThemeView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import type { ResearchThemeAdmin } from "~/lib/api/types/admin.types";
import type { ResearchThemeDetailPublic } from "~/lib/api/types/research.types";

export default function AdminResearchThemeViewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const themeId = () => params.id ?? "";

  const [admin, setAdmin] = createSignal<ResearchThemeAdmin | null>(null);
  const [publicDetail, setPublicDetail] =
    createSignal<ResearchThemeDetailPublic | null>(null);
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = themeId();
    if (id === "new") {
      navigate("/admin/research/new", { replace: true });
      return;
    }
    if (!id) return;
    try {
      const [adminRow, detail] = await Promise.all([
        adminResearchApi.get(id),
        adminResearchApi.preview(id),
      ]);
      setAdmin(adminRow);
      setPublicDetail(detail);
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        setNotFound(true);
        return;
      }
      setLoadError(getApiErrorMessage(error));
    }
  });

  return (
    <Show
      when={!notFound()}
      fallback={
        <EmptyState
          variant="list"
          title="Theme not found"
          description="This theme may have been deleted or the link is wrong."
        >
          <A href="/admin/research" class="siam-btn-primary no-underline">
            Back to research
          </A>
        </EmptyState>
      }
    >
      <Title>
        {admin()?.title ?? "Research theme"} — SIAM Admin
      </Title>
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={admin() && publicDetail()}>
        <AdminResearchThemeView
          themeId={themeId()}
          admin={admin()!}
          publicDetail={publicDetail()!}
          onAdminUpdated={async (theme) => {
            setAdmin(theme);
            try {
              setPublicDetail(await adminResearchApi.preview(theme.id));
            } catch {
              /* keep previous preview */
            }
          }}
        />
      </Show>
    </Show>
  );
}
