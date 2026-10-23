import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import DetailStubLayout from "~/components/catalog/DetailStubLayout";
import PublicationCitationActions from "~/components/publications/PublicationCitationActions";
import type {
  PublicationCitation,
  PublicationPublicDetail,
} from "~/lib/api/types/publication.types";
import { publicationAvailabilityLabel } from "~/lib/publications/publication-availability";

export type PublicationPublicDetailViewProps = {
  detail: PublicationPublicDetail;
  backHref: string;
  backLabel: string;
  showPermalink?: boolean;
  citation?: PublicationCitation | null;
  citationLoading?: boolean;
};

function formatType(type: PublicationPublicDetail["publicationType"]): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function PublicationPublicDetailView(
  props: PublicationPublicDetailViewProps,
) {
  const d = () => props.detail;
  const metaLines = () => {
    const parts = [
      `${d().authorsShort} · ${d().venue} · ${d().year}`,
      `${formatType(d().publicationType)}${d().peerReviewed ? " · Peer reviewed" : ""}`,
    ];
    return parts;
  };

  return (
    <DetailStubLayout
      title={d().title}
      backHref={props.backHref}
      backLabel={props.backLabel}
      metaLines={metaLines()}
    >
      <Show when={d().authors && d().authors!.length > 0}>
        <div class="mt-4 space-y-3">
          <h2 class="text-sm font-semibold text-ink">Authors</h2>
          <ul class="list-none space-y-2 pl-0">
            <For each={d().authors!}>
              {(author) => (
                <li class="text-sm">
                  <span class="font-medium text-ink">{author.name}</span>
                  <Show when={author.affiliation}>
                    <p class="text-ink-muted">{author.affiliation}</p>
                  </Show>
                  <Show when={author.orcid}>
                    <p class="font-mono text-xs text-ink-muted">
                      ORCID {author.orcid}
                    </p>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
      <p class="mt-2 text-sm text-ink-muted">
        {publicationAvailabilityLabel(d().availability)}
      </p>
      <Show when={d().significance}>
        <p class="mt-4 font-medium text-ink">{d().significance}</p>
      </Show>
      <Show when={d().abstract}>
        <>
          <h2 class="siam-headline-md mt-8 text-brand-deep">Abstract</h2>
          <p class="whitespace-pre-wrap">{d().abstract}</p>
        </>
      </Show>
      <Show when={d().doi}>
        <p class="mt-6 text-sm">
          DOI:{" "}
          <a
            href={`https://doi.org/${d().doi}`}
            class="text-link break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {d().doi}
          </a>
        </p>
      </Show>
      <Show when={d().publisherUrl}>
        <p class="mt-2 text-sm">
          <a
            href={d().publisherUrl}
            class="text-link break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            Publisher page
          </a>
        </p>
      </Show>
      <Show when={d().pdfHref}>
        <p class="mt-4">
          <a
            href={d().pdfHref}
            class="siam-btn-primary inline-flex no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
        </p>
      </Show>
      <Show when={d().supplements && d().supplements!.length > 0}>
        <div class="mt-8">
          <h2 class="siam-headline-md text-brand-deep">Supplementary materials</h2>
          <ul class="mt-3 list-none space-y-2 pl-0">
            <For each={d().supplements!}>
              {(item) => (
                <li>
                  <a
                    href={item.url}
                    class="text-link font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                  <span class="ml-2 text-xs text-ink-muted">({item.kind})</span>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
      <div class="mt-8">
        <h2 class="siam-headline-md text-brand-deep">Citation</h2>
        <div class="mt-3">
          <PublicationCitationActions
            citation={props.citation ?? undefined}
            loading={props.citationLoading}
          />
        </div>
      </div>
      <Show when={d().ownerContribution}>
        <>
          <h2 class="siam-headline-md mt-8 text-brand-deep">Your contribution</h2>
          <p class="whitespace-pre-wrap">{d().ownerContribution}</p>
        </>
      </Show>
      <Show when={d().correctionNotice}>
        <>
          <h2 class="siam-headline-md mt-8 text-brand-deep">Correction notice</h2>
          <p class="whitespace-pre-wrap text-sm text-ink-muted">
            {d().correctionNotice}
          </p>
        </>
      </Show>
      <Show when={props.showPermalink ?? true}>
        <p class="mt-8">
          <A
            href={`/publications/${d().slug}`}
            class="text-link font-medium no-underline hover:underline"
          >
            Permalink
          </A>
        </p>
      </Show>
    </DetailStubLayout>
  );
}
