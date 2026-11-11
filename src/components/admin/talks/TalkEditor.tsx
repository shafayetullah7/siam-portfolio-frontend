import { A, useNavigate } from "@solidjs/router";
import { createSignal, For, onMount, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import TalkPublishControls from "~/components/admin/talks/TalkPublishControls";
import TalkRelationsPanel from "~/components/admin/talks/TalkRelationsPanel";
import TalkResourcesEditor from "~/components/admin/talks/TalkResourcesEditor";
import { adminTalksApi } from "~/lib/api/endpoints/admin/talks.api";
import type { TalkAdminDetail } from "~/lib/api/types/talks.types";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import {
  emptyTalkDraft,
  fieldErrorsFromZod,
  talkDraftFromAdmin,
  talkWriteSchema,
  type TalkWriteInput,
} from "~/lib/forms/schemas/admin-talk.schema";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import { slugFromTitle } from "~/lib/slug/slugFromTitle";
import { fromDatetimeLocalValue, toDatetimeLocalValue } from "~/lib/talks/datetimeLocal";
import { formatTalkDateTimePreview } from "~/lib/talks/formatTalkDateTime";
import { ianaTimeZoneOptions } from "~/lib/talks/ianaTimeZones";
import {
  TALK_ROLE_LABELS,
  TALK_ROLES,
  TALK_TYPE_LABELS,
  TALK_TYPES,
} from "~/lib/talks/talkLabels";

export type TalkEditorProps = {
  talkId?: string;
};

export default function TalkEditor(props: TalkEditorProps) {
  const navigate = useNavigate();
  const isEdit = () => Boolean(props.talkId);
  const [draft, setDraft] = createSignal<TalkWriteInput>(emptyTalkDraft());
  const [slugManual, setSlugManual] = createSignal(false);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>(
    {},
  );
  const [formMessage, setFormMessage] = createSignal<string | null>(null);
  const [dirty, setDirty] = createSignal(false);
  const [loading, setLoading] = createSignal(isEdit());
  const [notFound, setNotFound] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [detail, setDetail] = createSignal<TalkAdminDetail | null>(null);
  const [publishStatus, setPublishStatus] = createSignal("draft");
  const timeZones = ianaTimeZoneOptions();

  useUnsavedChanges(dirty);

  function markDirty() {
    setDirty(true);
  }

  function patchDraft(patch: Partial<TalkWriteInput>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    markDirty();
  }

  function onTitleInput(value: string) {
    const patch: Partial<TalkWriteInput> = { title: value };
    if (!slugManual() && !isEdit()) {
      patch.slug = slugFromTitle(value);
    }
    patchDraft(patch);
  }

  const previewLine = () =>
    formatTalkDateTimePreview(draft().startsAt, draft().timezone);

  async function saveMetadata(e: Event) {
    e.preventDefault();
    setFormMessage(null);
    const parsed = talkWriteSchema.safeParse(draft());
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
    setFieldErrors({});
    setPending(true);
    try {
      const body = parsed.data;
      if (isEdit() && props.talkId) {
        const updated = await adminTalksApi.update(props.talkId, body);
        setDetail(updated);
        setDraft(talkDraftFromAdmin(updated));
        setPublishStatus(updated.publishStatus);
      } else {
        const created = await adminTalksApi.create(body);
        setDirty(false);
        navigate(`/admin/talks/${created.id}/edit`, { replace: true });
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
    if (!props.talkId) return;
    if (!window.confirm("Delete this talk permanently?")) return;
    try {
      await adminTalksApi.delete(props.talkId);
      navigate("/admin/talks", { replace: true });
    } catch (err) {
      setFormMessage(getApiErrorMessage(err));
    }
  }

  onMount(async () => {
    if (!props.talkId) {
      setLoading(false);
      return;
    }
    try {
      const row = await adminTalksApi.get(props.talkId);
      setDetail(row);
      setDraft(talkDraftFromAdmin(row));
      setPublishStatus(row.publishStatus);
      setSlugManual(true);
    } catch (err) {
      if (isApiError(err) && err.status === 404) setNotFound(true);
      else setFormMessage(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  });

  return (
    <Show
      when={!loading()}
      fallback={<p class="text-ink-muted">Loading…</p>}
    >
      <Show
        when={!notFound()}
        fallback={
          <EmptyState variant="detail" title="Talk not found">
            <A href="/admin/talks">Back to talks</A>
          </EmptyState>
        }
      >
        <AdminPageHeader
          title={isEdit() ? "Edit talk" : "New talk"}
          description="Basics, schedule, materials."
        >
          <div class="flex flex-wrap items-center gap-3">
            <Show when={isEdit()}>
              <PublishStatusBadge status={publishStatus()} />
            </Show>
            <Show when={props.talkId}>
              <TalkPublishControls
                talkId={props.talkId!}
                publishStatus={publishStatus()}
                onUpdated={(talk) => {
                  setDetail(talk);
                  setPublishStatus(talk.publishStatus);
                }}
              />
            </Show>
          </div>
        </AdminPageHeader>

        <Show when={formMessage()}>
          <div class="mt-4">
            <FormErrorAlert message={formMessage()!} />
          </div>
        </Show>

        <form class="mt-6 space-y-8" onSubmit={saveMetadata}>
          <section class="space-y-4 rounded-lg border border-border p-4">
            <h2 class="text-lg font-semibold">Basics</h2>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="text-sm md:col-span-2">
                <span class="text-ink-muted">Title</span>
                <input
                  class="siam-input mt-1 w-full"
                  value={draft().title}
                  onInput={(e) => onTitleInput(e.currentTarget.value)}
                />
                <Show when={fieldErrors().title}>
                  <span class="text-sm text-red-600">{fieldErrors().title}</span>
                </Show>
              </label>
              <label class="text-sm">
                <span class="text-ink-muted">Slug</span>
                <input
                  class="siam-input mt-1 w-full"
                  value={draft().slug}
                  onInput={(e) => {
                    setSlugManual(true);
                    patchDraft({ slug: e.currentTarget.value });
                  }}
                />
              </label>
              <label class="text-sm">
                <span class="text-ink-muted">Event / organizer</span>
                <input
                  class="siam-input mt-1 w-full"
                  value={draft().eventName}
                  onInput={(e) => patchDraft({ eventName: e.currentTarget.value })}
                />
              </label>
              <label class="text-sm md:col-span-2">
                <span class="text-ink-muted">Description</span>
                <textarea
                  class="siam-input mt-1 w-full min-h-[6rem]"
                  value={draft().description ?? ""}
                  onInput={(e) =>
                    patchDraft({
                      description: e.currentTarget.value || null,
                    })
                  }
                />
              </label>
              <label class="text-sm">
                <span class="text-ink-muted">Role</span>
                <select
                  class="siam-input mt-1 w-full"
                  value={draft().role}
                  onChange={(e) =>
                    patchDraft({
                      role: e.currentTarget.value as TalkWriteInput["role"],
                    })
                  }
                >
                  <For each={TALK_ROLES}>
                    {(r) => <option value={r}>{TALK_ROLE_LABELS[r]}</option>}
                  </For>
                </select>
              </label>
              <label class="text-sm">
                <span class="text-ink-muted">Talk type</span>
                <select
                  class="siam-input mt-1 w-full"
                  value={draft().talkType}
                  onChange={(e) =>
                    patchDraft({
                      talkType: e.currentTarget.value as TalkWriteInput["talkType"],
                    })
                  }
                >
                  <For each={TALK_TYPES}>
                    {(t) => <option value={t}>{TALK_TYPE_LABELS[t]}</option>}
                  </For>
                </select>
              </label>
              <label class="text-sm flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  checked={draft().isOnline ?? false}
                  onChange={(e) => patchDraft({ isOnline: e.currentTarget.checked })}
                />
                <span>Online event</span>
              </label>
              <label class="text-sm">
                <span class="text-ink-muted">Venue</span>
                <input
                  class="siam-input mt-1 w-full"
                  value={draft().venue ?? ""}
                  onInput={(e) =>
                    patchDraft({ venue: e.currentTarget.value || null })
                  }
                />
              </label>
              <label class="text-sm">
                <span class="text-ink-muted">Location</span>
                <input
                  class="siam-input mt-1 w-full"
                  value={draft().location ?? ""}
                  onInput={(e) =>
                    patchDraft({ location: e.currentTarget.value || null })
                  }
                />
              </label>
            </div>
          </section>

          <section class="space-y-4 rounded-lg border border-border p-4">
            <h2 class="text-lg font-semibold">Schedule</h2>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="text-sm">
                <span class="text-ink-muted">Starts at (local)</span>
                <input
                  type="datetime-local"
                  class="siam-input mt-1 w-full"
                  value={toDatetimeLocalValue(draft().startsAt)}
                  onInput={(e) => {
                    const iso = fromDatetimeLocalValue(e.currentTarget.value);
                    if (iso) patchDraft({ startsAt: iso });
                  }}
                />
              </label>
              <label class="text-sm">
                <span class="text-ink-muted">Ends at (optional)</span>
                <input
                  type="datetime-local"
                  class="siam-input mt-1 w-full"
                  value={toDatetimeLocalValue(draft().endsAt ?? "")}
                  onInput={(e) => {
                    const iso = fromDatetimeLocalValue(e.currentTarget.value);
                    patchDraft({ endsAt: iso });
                  }}
                />
              </label>
              <label class="text-sm md:col-span-2">
                <span class="text-ink-muted">IANA timezone</span>
                <select
                  class="siam-input mt-1 w-full max-w-md"
                  value={draft().timezone}
                  onChange={(e) => patchDraft({ timezone: e.currentTarget.value })}
                >
                  <For each={timeZones}>
                    {(tz) => <option value={tz}>{tz}</option>}
                  </For>
                </select>
              </label>
              <Show when={previewLine()}>
                <p class="text-sm text-ink-muted md:col-span-2">
                  Public preview: {previewLine()}
                </p>
              </Show>
            </div>
          </section>

          <div class="flex flex-wrap gap-3">
            <button type="submit" class="siam-btn-primary" disabled={pending()}>
              {pending() ? "Saving…" : "Save talk"}
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

        <Show when={detail()}>
          {(d) => (
            <>
              <div class="mt-8">
                <TalkResourcesEditor
                  talkId={d().id}
                  initial={d().resources}
                  onSaved={(resources) =>
                    setDetail((prev) =>
                      prev ? { ...prev, resources } : prev,
                    )
                  }
                />
              </div>
              <div class="mt-8">
                <TalkRelationsPanel
                  talkId={d().id}
                  slug={d().slug}
                  relations={d().relations}
                  onSaved={(relations) =>
                    setDetail((prev) =>
                      prev ? { ...prev, relations } : prev,
                    )
                  }
                />
              </div>
            </>
          )}
        </Show>
      </Show>
    </Show>
  );
}
