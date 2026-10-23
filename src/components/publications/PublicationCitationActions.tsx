import { createSignal, Show } from "solid-js";
import { copyToClipboard } from "~/lib/copy-to-clipboard";
import type { PublicationCitation } from "~/lib/api/types/publication.types";

export type PublicationCitationActionsProps = {
  citation?: PublicationCitation;
  loading?: boolean;
  error?: string;
  showPreviews?: boolean;
};

export default function PublicationCitationActions(
  props: PublicationCitationActionsProps,
) {
  const [copied, setCopied] = createSignal<"citation" | "bibtex" | null>(null);

  async function handleCopy(kind: "citation" | "bibtex", text: string) {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    }
  }

  return (
    <div class="space-y-3">
      <Show when={props.loading}>
        <p class="text-sm text-ink-muted">Loading citation…</p>
      </Show>
      <Show when={props.error}>
        <p class="text-sm text-red-600" role="alert">{props.error}</p>
      </Show>
      <Show when={props.citation}>
        {(c) => (
          <>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="siam-btn-secondary text-sm"
                aria-label="Copy formatted citation"
                onClick={() => void handleCopy("citation", c().formatted)}
              >
                Copy citation
              </button>
              <button
                type="button"
                class="siam-btn-secondary text-sm"
                aria-label="Copy BibTeX"
                onClick={() => void handleCopy("bibtex", c().bibtex)}
              >
                Copy BibTeX
              </button>
              <Show when={copied() === "citation"}>
                <span class="text-sm text-ink-muted" role="status">
                  Citation copied
                </span>
              </Show>
              <Show when={copied() === "bibtex"}>
                <span class="text-sm text-ink-muted" role="status">
                  BibTeX copied
                </span>
              </Show>
            </div>
            <Show when={props.showPreviews}>
              <p class="font-mono text-xs text-ink-muted">
                Cite key: {c().citeKey}
              </p>
              <div class="space-y-2">
                <pre
                  class="overflow-x-auto rounded-lg bg-surface-container-low p-3 text-xs whitespace-pre-wrap"
                >
                  {c().formatted}
                </pre>
                <pre
                  class="overflow-x-auto rounded-lg bg-surface-container-low p-3 text-xs whitespace-pre-wrap"
                >
                  {c().bibtex}
                </pre>
              </div>
            </Show>
          </>
        )}
      </Show>
    </div>
  );
}
