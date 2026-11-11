import { Show } from "solid-js";
import type { AcademicServicePublicRow } from "~/lib/api/types/talks.types";
import { ACADEMIC_SERVICE_TYPE_LABELS } from "~/lib/talks/talkLabels";

export type AcademicServiceRowProps = {
  row: AcademicServicePublicRow;
};

function yearRange(start?: number | null, end?: number | null): string | null {
  if (start == null && end == null) return null;
  if (start != null && end != null) return `${start}–${end}`;
  if (start != null) return `From ${start}`;
  return `Until ${end}`;
}

export default function AcademicServiceRow(props: AcademicServiceRowProps) {
  const row = () => props.row;
  const years = () => yearRange(row().startYear, row().endYear);

  return (
    <li class="rounded-lg border border-border bg-surface-container-lowest p-5">
      <p class="font-mono text-xs text-primary">
        {ACADEMIC_SERVICE_TYPE_LABELS[row().serviceType]}
      </p>
      <h3 class="mt-1 text-base font-semibold text-brand-deep">{row().organization}</h3>
      <p class="text-sm text-ink">{row().roleTitle}</p>
      <Show when={years()}>
        <p class="mt-1 text-sm text-ink-muted">{years()}</p>
      </Show>
      <Show when={row().summary?.trim()}>
        <p class="mt-2 text-sm text-secondary">{row().summary}</p>
      </Show>
      <Show when={row().proofUrl?.trim()}>
        <p class="mt-3">
          <a
            href={row().proofUrl!}
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium text-link no-underline hover:underline"
          >
            Proof / reference
          </a>
        </p>
      </Show>
    </li>
  );
}
