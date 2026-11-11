import { A, useNavigate } from "@solidjs/router";
import { createSignal, For, onMount, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminAcademicServiceApi } from "~/lib/api/endpoints/admin/academic-service.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import {
  academicServiceDraftFromAdmin,
  academicServiceWriteSchema,
  emptyAcademicServiceDraft,
  type AcademicServiceWriteInput,
} from "~/lib/forms/schemas/academic-service-write.schema";
import AcademicServicePublishControls from "~/components/admin/talks/AcademicServicePublishControls";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import {
  ACADEMIC_SERVICE_TYPE_LABELS,
  ACADEMIC_SERVICE_TYPES,
} from "~/lib/talks/talkLabels";

export type AcademicServiceEditorProps = {
  entryId?: string;
};

export default function AcademicServiceEditor(props: AcademicServiceEditorProps) {
  const navigate = useNavigate();
  const isEdit = () => Boolean(props.entryId);
  const [draft, setDraft] = createSignal<AcademicServiceWriteInput>(
    emptyAcademicServiceDraft(),
  );
  const [formMessage, setFormMessage] = createSignal<string | null>(null);
  const [dirty, setDirty] = createSignal(false);
  const [loading, setLoading] = createSignal(isEdit());
  const [notFound, setNotFound] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [publishStatus, setPublishStatus] = createSignal("draft");

  useUnsavedChanges(dirty);

  function patchDraft(patch: Partial<AcademicServiceWriteInput>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }

  async function save(e: Event) {
    e.preventDefault();
    const parsed = academicServiceWriteSchema.safeParse(draft());
    if (!parsed.success) {
      setFormMessage("Fix validation errors before saving.");
      return;
    }
    setPending(true);
    setFormMessage(null);
    try {
      if (isEdit() && props.entryId) {
        const updated = await adminAcademicServiceApi.update(
          props.entryId,
          parsed.data,
        );
        setDraft(academicServiceDraftFromAdmin(updated));
        setPublishStatus(updated.publishStatus);
      } else {
        const created = await adminAcademicServiceApi.create(parsed.data);
        setDirty(false);
        navigate(`/admin/talks/service/${created.id}/edit`, { replace: true });
        return;
      }
      setDirty(false);
    } catch (err) {
      setFormMessage(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!props.entryId) return;
    if (!window.confirm("Delete this entry?")) return;
    await adminAcademicServiceApi.delete(props.entryId);
    navigate("/admin/talks/service", { replace: true });
  }

  onMount(async () => {
    if (!props.entryId) {
      setLoading(false);
      return;
    }
    try {
      const row = await adminAcademicServiceApi.get(props.entryId);
      setDraft(academicServiceDraftFromAdmin(row));
      setPublishStatus(row.publishStatus);
    } catch (err) {
      if (isApiError(err) && err.status === 404) setNotFound(true);
      else setFormMessage(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  });

  return (
    <Show when={!loading()} fallback={<p>Loading…</p>}>
      <Show
        when={!notFound()}
        fallback={
          <EmptyState variant="detail" title="Not found">
            <A href="/admin/talks/service">Back</A>
          </EmptyState>
        }
      >
        <AdminPageHeader title={isEdit() ? "Edit entry" : "New entry"}>
          <div class="flex gap-3 items-center">
            <Show when={isEdit()}>
              <PublishStatusBadge status={publishStatus()} />
            </Show>
            <Show when={props.entryId}>
              <AcademicServicePublishControls
                entryId={props.entryId!}
                publishStatus={publishStatus()}
                onUpdated={(row) => {
                  setDraft(academicServiceDraftFromAdmin(row));
                  setPublishStatus(row.publishStatus);
                }}
              />
            </Show>
          </div>
        </AdminPageHeader>
        <Show when={formMessage()}>
          <FormErrorAlert message={formMessage()!} />
        </Show>
        <form class="mt-6 max-w-2xl space-y-4" onSubmit={save}>
          <label class="block text-sm">
            <span class="text-ink-muted">Service type</span>
            <select
              class="siam-input mt-1 w-full"
              value={draft().serviceType}
              onChange={(e) =>
                patchDraft({
                  serviceType: e.currentTarget
                    .value as AcademicServiceWriteInput["serviceType"],
                })
              }
            >
              <For each={ACADEMIC_SERVICE_TYPES}>
                {(t) => (
                  <option value={t}>{ACADEMIC_SERVICE_TYPE_LABELS[t]}</option>
                )}
              </For>
            </select>
          </label>
          <label class="block text-sm">
            <span class="text-ink-muted">Organization</span>
            <input
              class="siam-input mt-1 w-full"
              value={draft().organization}
              onInput={(e) => patchDraft({ organization: e.currentTarget.value })}
            />
          </label>
          <label class="block text-sm">
            <span class="text-ink-muted">Role title</span>
            <input
              class="siam-input mt-1 w-full"
              value={draft().roleTitle}
              onInput={(e) => patchDraft({ roleTitle: e.currentTarget.value })}
            />
          </label>
          <p class="grid grid-cols-2 gap-4">
            <label class="text-sm">
              <span class="text-ink-muted">Start year</span>
              <input
                type="number"
                class="siam-input mt-1 w-full"
                value={draft().startYear ?? ""}
                onInput={(e) =>
                  patchDraft({
                    startYear: e.currentTarget.value
                      ? Number(e.currentTarget.value)
                      : null,
                  })
                }
              />
            </label>
            <label class="text-sm">
              <span class="text-ink-muted">End year</span>
              <input
                type="number"
                class="siam-input mt-1 w-full"
                value={draft().endYear ?? ""}
                onInput={(e) =>
                  patchDraft({
                    endYear: e.currentTarget.value
                      ? Number(e.currentTarget.value)
                      : null,
                  })
                }
              />
            </label>
          </p>
          <label class="block text-sm">
            <span class="text-ink-muted">Proof URL (https)</span>
            <input
              class="siam-input mt-1 w-full"
              type="url"
              value={draft().proofUrl ?? ""}
              onInput={(e) =>
                patchDraft({ proofUrl: e.currentTarget.value || null })
              }
            />
          </label>
          <label class="block text-sm">
            <span class="text-ink-muted">Summary</span>
            <textarea
              class="siam-input mt-1 w-full min-h-[4rem]"
              value={draft().summary ?? ""}
              onInput={(e) =>
                patchDraft({ summary: e.currentTarget.value || null })
              }
            />
          </label>
          <div class="flex gap-3">
            <button type="submit" class="siam-btn-primary" disabled={pending()}>
              Save
            </button>
            <Show when={isEdit()}>
              <button
                type="button"
                class="siam-btn-ghost text-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </Show>
          </div>
        </form>
      </Show>
    </Show>
  );
}
