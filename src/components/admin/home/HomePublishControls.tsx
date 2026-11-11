import { revalidate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import HomePublishChecklistDialog from "~/components/admin/home/HomePublishChecklistDialog";
import { adminHomeApi } from "~/lib/api/endpoints/admin/home.api";
import { adminProfileApi } from "~/lib/api/endpoints/admin/profile.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import { getPublicAbout, getPublicHome } from "~/lib/api/queries/public";
import type {
  HomePublishChecklist,
  HomepageAdmin,
  ProfileAdmin,
} from "~/lib/api/types/home.types";

export type HomePublishControlsProps = {
  target: "homepage" | "profile";
  publishStatus: string;
  label: string;
  variant?: "compact" | "bar";
  onHomepageUpdated?: (row: HomepageAdmin) => void;
  onProfileUpdated?: (row: ProfileAdmin) => void;
};

function revalidatePublicCaches() {
  revalidate(getPublicHome.key);
  revalidate(getPublicAbout.key);
}

export default function HomePublishControls(props: HomePublishControlsProps) {
  const variant = () => props.variant ?? "compact";
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [checklist, setChecklist] =
    createSignal<HomePublishChecklist | null>(null);

  const canPublish = () =>
    props.publishStatus === "draft" || props.publishStatus === "scheduled";
  const canUnpublish = () =>
    props.publishStatus === "published" || props.publishStatus === "scheduled";

  async function runPublish(confirmWarnings: boolean) {
    setPending(true);
    setError(null);
    try {
      if (props.target === "homepage") {
        const row = await adminHomeApi.publish({ confirmWarnings });
        setDialogOpen(false);
        props.onHomepageUpdated?.(row);
      } else {
        const row = await adminProfileApi.publish({ confirmWarnings });
        setDialogOpen(false);
        props.onProfileUpdated?.(row);
      }
      revalidatePublicCaches();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handlePublishClick() {
    setError(null);
    setPending(true);
    try {
      const check =
        props.target === "homepage"
          ? await adminHomeApi.getPublishCheck()
          : await adminProfileApi.getPublishCheck();
      if (check.errors.length > 0 || check.warnings.length > 0) {
        setChecklist(check);
        setDialogOpen(true);
        return;
      }
      await runPublish(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handleUnpublish() {
    setPending(true);
    setError(null);
    try {
      if (props.target === "homepage") {
        const row = await adminHomeApi.unpublish();
        props.onHomepageUpdated?.(row);
      } else {
        const row = await adminProfileApi.unpublish();
        props.onProfileUpdated?.(row);
      }
      revalidatePublicCaches();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const primaryClass = () =>
    variant() === "compact"
      ? "siam-btn-primary px-2 py-1 text-xs"
      : "siam-btn-primary";
  const secondaryClass = () =>
    variant() === "compact"
      ? "siam-btn-secondary px-2 py-1 text-xs"
      : "siam-btn-secondary";

  return (
    <>
      <div
        class="flex flex-col gap-1"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <span class="text-xs text-ink-muted">{props.label}</span>
        <div class="flex flex-wrap items-center gap-1">
          <Show when={canPublish()}>
            <button
              type="button"
              class={primaryClass()}
              disabled={pending()}
              onClick={() => void handlePublishClick()}
            >
              {pending() ? "…" : "Publish"}
            </button>
          </Show>
          <Show when={canUnpublish()}>
            <button
              type="button"
              class={secondaryClass()}
              disabled={pending()}
              onClick={() => void handleUnpublish()}
            >
              {pending() ? "…" : "Unpublish"}
            </button>
          </Show>
        </div>
        <Show when={error()}>
          <span class="text-xs text-red-600" role="alert">
            {error()}
          </span>
        </Show>
      </div>
      <HomePublishChecklistDialog
        open={dialogOpen()}
        checklist={checklist()}
        pending={pending()}
        onClose={() => setDialogOpen(false)}
        onPublishAnyway={() => void runPublish(true)}
      />
    </>
  );
}
