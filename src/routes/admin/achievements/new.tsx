import { useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import TimelineEntryEditor from "~/components/admin/timeline/TimelineEntryEditor";
import TimelineKindPicker from "~/components/admin/timeline/TimelineKindPicker";
import type { TimelineEntryKind } from "~/lib/api/types/timeline.types";

export default function AdminAchievementsNew() {
  const [searchParams, setSearchParams] = useSearchParams();
  const kindParam = () => searchParams.kind as TimelineEntryKind | undefined;
  const [pickedKind, setPickedKind] = createSignal<TimelineEntryKind | null>(
    kindParam() ?? null,
  );

  const activeKind = () => pickedKind() ?? kindParam() ?? null;

  function selectKind(kind: TimelineEntryKind) {
    setPickedKind(kind);
    setSearchParams({ kind });
  }

  return (
    <div>
      <Title>New timeline entry — SIAM Admin</Title>
      <Show
        when={activeKind()}
        fallback={
          <>
            <AdminPageHeader
              title="New timeline entry"
              description="Choose what type of entry you are adding (A07)."
            />
            <div class="mt-6 max-w-2xl">
              <TimelineKindPicker
                selected={pickedKind()}
                onSelect={selectKind}
              />
            </div>
          </>
        }
      >
        <TimelineEntryEditor entryId="new" initialKind={activeKind()!} />
      </Show>
    </div>
  );
}
