import { Show } from "solid-js";
import { isImageMime } from "./media-upload";

export default function MediaAssetThumb(props: {
  url: string;
  fileName: string;
  mimeType: string | null;
}) {
  const isImage = () => isImageMime(props.mimeType);
  const isPdf = () => props.mimeType === "application/pdf";

  return (
    <div
      class="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-surface text-on-surface-variant"
    >
      <Show
        when={isImage()}
        fallback={
          <div class="flex flex-col items-center gap-1 p-2 text-center">
            <span class="text-2xl font-semibold" aria-hidden="true">
              {isPdf() ? "PDF" : "FILE"}
            </span>
            <span class="line-clamp-2 text-[10px] leading-tight">{props.fileName}</span>
          </div>
        }
      >
        <img
          src={props.url}
          alt=""
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </Show>
    </div>
  );
}
