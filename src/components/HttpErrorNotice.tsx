import { Show } from "solid-js";
import { getApiErrorUserMessage } from "~/lib/api/errors";

export default function HttpErrorNotice(props: {
  error: unknown;
  onRetry?: () => void;
}) {
  const copy = () => getApiErrorUserMessage(props.error);
  return (
    <div class="siam-container py-12" role="alert">
      <p class="text-lg font-semibold text-ink">{copy().title}</p>
      <p class="mt-2 max-w-lg text-sm text-ink-muted">{copy().description}</p>
      <Show when={props.onRetry}>
        <button
          type="button"
          class="siam-btn-secondary mt-6"
          onClick={() => props.onRetry?.()}
        >
          Try again
        </button>
      </Show>
    </div>
  );
}
