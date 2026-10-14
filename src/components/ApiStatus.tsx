import { createSignal, onMount, Show } from "solid-js";
import { healthPublicApi } from "~/lib/api/endpoints/public/health.api";
import type { HealthResponse } from "~/lib/api/types/public.types";
import { ApiError } from "~/lib/api/types";

export default function ApiStatus() {
  const [health, setHealth] = createSignal<HealthResponse | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const result = await healthPublicApi.get();
      setHealth(result);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "API unreachable");
    }
  });

  return (
    <p class="mt-8 text-xs text-ink-subtle" aria-live="polite">
      <Show when={health()} fallback={error() ? `API: ${error()}` : "Checking API…"}>
        {(h) => (
          <>
            API health: {h().status}, database {h().database}
          </>
        )}
      </Show>
    </p>
  );
}
