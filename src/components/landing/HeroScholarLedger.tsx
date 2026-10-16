import { For, Show } from "solid-js";
import type { HomeHeroLedger } from "~/content";
import { ArrowExternal } from "~/icons";

const DEFAULT_METRICS = [
  { value: "—", label: "Peer-reviewed pubs" },
  { value: "—", label: "Citations tracked" },
  { value: "—", label: "Open artifacts" },
  { value: "—", label: "Top venues" },
] as const;

export type HeroScholarLedgerProps = {
  ledger?: HomeHeroLedger;
};

export default function HeroScholarLedger(props: HeroScholarLedgerProps) {
  const header = () => props.ledger?.headerLabel ?? "Scholar ledger";
  const metrics = () =>
    props.ledger?.metrics?.length ? props.ledger.metrics : DEFAULT_METRICS;

  return (
    <div
      class="relative flex w-full flex-col gap-4 overflow-hidden rounded-xl bg-surface-container-low p-5 shadow-inner sm:p-6"
      aria-label="Research metrics summary"
    >
      <div
        class="pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 text-primary opacity-10"
        aria-hidden="true"
      >
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke-dasharray="3 3" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="15" />
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" />
        </svg>
      </div>

      <div class="flex items-center justify-between gap-2">
        <span class="siam-eyebrow text-secondary">{header()}</span>
        <Show when={props.ledger?.orcid?.trim()}>
          <span class="rounded bg-primary px-2 py-0.5 font-mono text-xs font-medium text-primary-foreground">
            ORCID {props.ledger!.orcid}
          </span>
        </Show>
      </div>

      <div class="relative flex h-32 flex-col justify-between rounded-lg bg-surface-container-lowest p-3 shadow-sm">
        <div class="flex items-center justify-between text-secondary">
          <span class="flex items-center gap-1 font-mono text-xs">
            <span class="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            Research activity
          </span>
        </div>
        <svg class="h-14 w-full" fill="none" viewBox="0 0 280 60" aria-hidden="true">
          <path
            class="text-primary"
            d="M5 45 C 45 45, 60 15, 100 20 C 140 25, 150 50, 190 35 C 230 20, 250 10, 275 12"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            class="text-secondary"
            d="M5 50 C 50 50, 75 35, 115 40 C 155 45, 175 18, 220 22 C 245 25, 260 30, 275 28"
            stroke="currentColor"
            stroke-dasharray="3 2"
            stroke-width="1"
          />
        </svg>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <For each={metrics()}>
          {(metric) => (
            <div class="flex flex-col rounded-lg bg-surface-container-lowest p-2">
              <span class="siam-headline-md leading-none text-primary">{metric.value}</span>
              <span class="mt-1 font-mono text-xs text-secondary">{metric.label}</span>
            </div>
          )}
        </For>
      </div>

      <div class="flex items-center justify-between font-mono text-xs text-secondary">
        <span>Portfolio metrics</span>
        <a
          href="https://scholar.google.com/"
          class="inline-flex items-center gap-0.5 text-link no-underline hover:underline"
        >
          View
          <ArrowExternal class="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
