import { A } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import PublicationCitationActions from "~/components/publications/PublicationCitationActions";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import PublicationPublishControls from "~/components/admin/publications/PublicationPublishControls";
import type { PublicationAdminSummary } from "~/lib/api/endpoints/admin/publications.api";

export type AdminPublicationViewProps = {
  publication: PublicationAdminSummary;
  onPublicationUpdated?: (publication: PublicationAdminSummary) => void;
};

function formatWhen(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function field(label: string, value: string | null | undefined) {
  const text = value?.trim();
  if (!text) return null;
  return (
    <div>
      <dt class="text-sm text-ink-muted">{label}</dt>
      <dd class="mt-0.5 text-ink whitespace-pre-wrap">{text}</dd>
    </div>
  );
}

export default function AdminPublicationView(props: AdminPublicationViewProps) {
  const p = () => props.publication;
  const [citation, { refetch: refetchCitation }] = createResource(
    () => p().id,
    (id) => adminPublicationsApi.citation(id),
  );

  return (
    <div class="max-w-3xl min-w-0">
      <AdminPageHeader
        title={p().title}
        description={`/${p().slug} · ${p().authorsShort} · ${p().year}`}
      >
        <A
          href={`/admin/publications/${p().id}/edit`}
          class="siam-btn-primary no-underline"
        >
          Edit
        </A>
        <A
          href={`/admin/publications/${p().id}/preview`}
          class="siam-btn-secondary no-underline"
        >
          Public preview
        </A>
        <PublicationPublishControls
          publicationId={p().id}
          publishStatus={p().publishStatus}
          variant="bar"
          onUpdated={(pub) => {
            props.onPublicationUpdated?.(pub);
            void refetchCitation();
          }}
        />
        <A href="/admin/publications" class="siam-btn-secondary no-underline">
          Back to list
        </A>
      </AdminPageHeader>

      <div
        class="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-container-lowest px-4 py-3 text-sm"
      >
        <PublishStatusBadge status={p().publishStatus} />
        <span class="text-ink-muted">
          Slug: <span class="font-mono text-ink">{p().slug}</span>
        </span>
        <Show when={formatWhen(p().updatedAt)}>
          <span class="text-ink-muted">Updated {formatWhen(p().updatedAt)}</span>
        </Show>
        <Show when={formatWhen(p().publishedAt)}>
          <span class="text-ink-muted">
            Published {formatWhen(p().publishedAt)}
          </span>
        </Show>
        <Show when={formatWhen(p().scheduledAt)}>
          <span class="text-ink-muted">
            Scheduled {formatWhen(p().scheduledAt)}
          </span>
        </Show>
      </div>

      <p class="mt-4 text-sm text-ink-muted">
        Public listing and detail pages still use the static catalog until PUB8.
        You can open{" "}
        <A href={`/publications/${p().slug}`} class="text-link">
          /publications/{p().slug}
        </A>{" "}
        to check the public URL (visible only when published).
      </p>

      <section class="mt-8 rounded-lg border border-border bg-surface-container-lowest p-4">
        <h2 class="text-sm font-semibold text-ink">Citation preview</h2>
        <p class="mt-1 text-sm text-ink-muted">
          BibTeX and formatted citation from current metadata (including drafts).
        </p>
        <div class="mt-4">
          <PublicationCitationActions
            citation={citation()}
            loading={citation.loading}
            error={citation.error ? "Could not load citation." : undefined}
            showPreviews
          />
        </div>
      </section>

      <dl class="mt-8 space-y-4">
        <div>
          <dt class="text-sm text-ink-muted">Type</dt>
          <dd class="mt-0.5 capitalize text-ink">{p().publicationType}</dd>
        </div>
        <div>
          <dt class="text-sm text-ink-muted">Venue</dt>
          <dd class="mt-0.5 text-ink">{p().venue}</dd>
        </div>
        <Show when={p().peerReviewed}>
          <div>
            <dt class="text-sm text-ink-muted">Peer reviewed</dt>
            <dd class="mt-0.5 text-ink">Yes</dd>
          </div>
        </Show>
        <Show when={p().doi}>
          <div>
            <dt class="text-sm text-ink-muted">DOI</dt>
            <dd class="mt-0.5">
              <a
                href={`https://doi.org/${p().doi}`}
                class="text-link break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {p().doi}
              </a>
            </dd>
          </div>
        </Show>
        <Show when={p().publisherUrl}>
          <div>
            <dt class="text-sm text-ink-muted">Publisher URL</dt>
            <dd class="mt-0.5">
              <a
                href={p().publisherUrl!}
                class="text-link break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {p().publisherUrl}
              </a>
            </dd>
          </div>
        </Show>
        {field("Abstract", p().abstract)}
        {field("Significance", p().significance)}
        {field("Your contribution", p().ownerContribution)}
        {field("Correction notice", p().correctionNotice)}
        {field("SEO title", p().seoTitle)}
        {field("SEO description", p().seoDescription)}
        <div>
          <dt class="text-sm text-ink-muted">Featured</dt>
          <dd class="mt-0.5 text-ink">
            {p().featured ? "Yes" : "No"}
            {p().featuredOnHome ? " · Featured on home" : ""}
            {p().hideFromSearch ? " · Hidden from search" : ""}
          </dd>
        </div>
        <div>
          <dt class="text-sm text-ink-muted">Last updated</dt>
          <dd class="mt-0.5 text-ink">{formatWhen(p().updatedAt)}</dd>
        </div>
      </dl>
    </div>
  );
}
