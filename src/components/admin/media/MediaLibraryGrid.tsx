import { For } from "solid-js";
import type { MediaAdmin } from "~/lib/api/types/admin.types";
import MediaAssetThumb from "./MediaAssetThumb";
import { formatMediaBytes } from "./media-upload";

export type MediaLibraryGridProps = {
  items: MediaAdmin[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function MediaLibraryGrid(props: MediaLibraryGridProps) {
  return (
    <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <For each={props.items}>
        {(item) => {
          const selected = () => props.selectedId === item.id;
          return (
            <li>
              <button
                type="button"
                class="w-full rounded-lg border p-2 text-left transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                classList={{
                  "border-primary ring-2 ring-primary/30": selected(),
                  "border-border": !selected(),
                }}
                aria-pressed={selected()}
                onClick={() => props.onSelect(item.id)}
              >
                <MediaAssetThumb
                  url={item.url}
                  fileName={item.fileName}
                  mimeType={item.mimeType}
                />
                <p class="mt-2 truncate text-xs font-medium text-ink" title={item.fileName}>
                  {item.fileName}
                </p>
                <p class="text-[10px] text-ink-muted">
                  {formatMediaBytes(item.size)}
                  {item.usesCount > 0 ? ` · In use (${item.usesCount})` : ""}
                </p>
              </button>
            </li>
          );
        }}
      </For>
    </ul>
  );
}
