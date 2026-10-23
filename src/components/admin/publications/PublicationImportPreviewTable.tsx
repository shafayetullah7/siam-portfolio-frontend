import type { PublicationImportProposed } from "~/lib/api/types/publication.types";

type Props = {
  proposed: PublicationImportProposed;
};

export default function PublicationImportPreviewTable(props: Props) {
  const p = () => props.proposed;
  return (
    <dl class="grid gap-2 text-sm sm:grid-cols-[minmax(6rem,auto)_1fr]">
      <dt class="text-ink-muted">Title</dt>
      <dd class="text-ink">{p().title}</dd>
      <dt class="text-ink-muted">Authors</dt>
      <dd class="text-ink">
        {p().authors.map((a) => a.name).join("; ")}
      </dd>
      <dt class="text-ink-muted">Year</dt>
      <dd class="text-ink">{p().year}</dd>
      <dt class="text-ink-muted">Venue</dt>
      <dd class="text-ink">{p().venue}</dd>
      <dt class="text-ink-muted">Type</dt>
      <dd class="text-ink">{p().publicationType}</dd>
      <dt class="text-ink-muted">DOI</dt>
      <dd class="text-ink">{p().doi ?? "—"}</dd>
      <dt class="text-ink-muted">Slug (suggested)</dt>
      <dd class="font-mono text-xs text-ink">{p().slug}</dd>
    </dl>
  );
}
