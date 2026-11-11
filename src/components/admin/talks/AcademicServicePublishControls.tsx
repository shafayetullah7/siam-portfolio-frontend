import { revalidate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import TalkPublishChecklistDialog from "~/components/admin/talks/TalkPublishChecklistDialog";
import { adminAcademicServiceApi } from "~/lib/api/endpoints/admin/academic-service.api";
import type {
  AcademicServiceAdmin,
  TalkPublishChecklist,
} from "~/lib/api/types/talks.types";
import { getApiErrorMessage } from "~/lib/api/errors";
import { getPublicCollaborationsPage } from "~/lib/api/queries/public/collaborations.queries";

export type AcademicServicePublishControlsProps = {
  entryId: string;
  publishStatus: string;
  onUpdated?: (row: AcademicServiceAdmin) => void;
};

export default function AcademicServicePublishControls(
  props: AcademicServicePublishControlsProps,
) {
  const [pending, setPending] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [checklist, setChecklist] =
    createSignal<TalkPublishChecklist | null>(null);

  async function runPublish(confirmWarnings: boolean) {
    setPending(true);
    try {
      const row = await adminAcademicServiceApi.publish(props.entryId, {
        confirmWarnings,
      });
      setDialogOpen(false);
      props.onUpdated?.(row);
      revalidate(getPublicCollaborationsPage.key);
    } finally {
      setPending(false);
    }
  }

  async function handlePublish() {
    setPending(true);
    try {
      const check = await adminAcademicServiceApi.getPublishCheck(
        props.entryId,
      );
      if (check.errors.length > 0 || check.warnings.length > 0) {
        setChecklist(check);
        setDialogOpen(true);
        return;
      }
      await runPublish(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Show
        when={
          props.publishStatus === "draft" || props.publishStatus === "scheduled"
        }
      >
        <button
          type="button"
          class="siam-btn-primary"
          disabled={pending()}
          onClick={() => void handlePublish()}
        >
          Publish
        </button>
      </Show>
      <TalkPublishChecklistDialog
        open={dialogOpen()}
        checklist={checklist()}
        pending={pending()}
        onClose={() => setDialogOpen(false)}
        onPublishAnyway={() => void runPublish(true)}
      />
    </>
  );
}
