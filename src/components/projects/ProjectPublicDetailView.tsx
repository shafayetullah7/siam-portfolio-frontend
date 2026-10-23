import { A } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import DetailStubLayout from "~/components/catalog/DetailStubLayout";
import type {
  ProjectPublicDetail,
  ProjectResourceType,
} from "~/lib/api/types/project.types";
import EvaluationMaturityBadge from "~/components/projects/EvaluationMaturityBadge";
import {
  PROJECT_RESOURCE_TYPE_LABELS,
  PROJECT_SECTION_KIND_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_LABELS,
} from "~/lib/projects/projectLabels";
import { formatDisplayDate } from "~/lib/utils/formatDisplayDate";

const PRIMARY_RESOURCE_TYPES: ProjectResourceType[] = ["repo", "demo"];

export type ProjectPublicDetailViewProps = {
  detail: ProjectPublicDetail;
  backHref: string;
  backLabel: string;
  showPermalink?: boolean;
};

function formatPeriod(start?: string, end?: string): string | null {
  if (!start && !end) return null;
  if (start && end) {
    return `${formatDisplayDate(start)} – ${formatDisplayDate(end)}`;
  }
  if (start) return `From ${formatDisplayDate(start)}`;
  return `Until ${formatDisplayDate(end!)}`;
}

export default function ProjectPublicDetailView(
  props: ProjectPublicDetailViewProps,
) {
  const d = () => props.detail;

  const metaLines = () => {
    const lines = [
      `${PROJECT_TYPE_LABELS[d().projectType]} · ${PROJECT_STATUS_LABELS[d().projectStatus]}`,
    ];
    const period = formatPeriod(d().periodStart, d().periodEnd);
    if (period) lines.push(period);
    if (d().tags && d().tags.length > 0) {
      lines.push(d().tags!.join(" · "));
    }
    return lines;
  };

  const sortedSections = () =>
    [...d().sections].sort((a, b) => a.sortOrder - b.sortOrder);

  const sortedMetrics = () =>
    [...d().metrics].sort((a, b) => a.sortOrder - b.sortOrder);

  const sortedResources = () =>
    [...d().resources].sort((a, b) => a.sortOrder - b.sortOrder);

  const primaryResources = createMemo(() => {
    const resources = sortedResources();
    const primaries = resources.filter((r) =>
      PRIMARY_RESOURCE_TYPES.includes(r.resourceType),
    );
    return primaries.length > 0 ? primaries : resources.slice(0, 2);
  });

  const coverAlt = () => d().cover?.alt?.trim() ?? "";

  const metricsWithCaptions = () =>
    sortedMetrics().filter((m) => (m.caption?.trim() ?? "") !== "");

  return (
    <DetailStubLayout
      title={d().title}
      backHref={props.backHref}
      backLabel={props.backLabel}
      metaLines={metaLines()}
      detailSlugBase="/projects"
      prevSlug={d().prevSlug}
      nextSlug={d().nextSlug}
      themeNavPrevLabel="Previous project"
      themeNavNextLabel="Next project"
      detailNavAriaLabel="Project navigation"
      relatedLinks={[
        { label: "Research", href: "/research" },
        { label: "Publications", href: "/publications" },
      ]}
    >
      <Show when={props.showPermalink}>
        <p class="text-sm text-ink-muted">
          Public URL:{" "}
          <A href={d().href} class="text-link font-mono">
            {d().href}
          </A>
        </p>
      </Show>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <EvaluationMaturityBadge maturity={d().evaluationMaturity} />
      </div>

      <Show when={d().cover && coverAlt()}>
        <img
          src={d().cover!.url}
          alt={coverAlt()}
          class="mt-6 max-h-80 w-full rounded-lg object-cover"
          loading="lazy"
          decoding="async"
        />
      </Show>

      <p class="mt-6 whitespace-pre-wrap text-secondary">{d().summary}</p>

      <Show when={d().resultTeaser}>
        <p class="mt-4 text-sm font-medium text-ink">{d().resultTeaser}</p>
      </Show>

      <Show when={primaryResources().length > 0}>
        <div class="mt-6 flex flex-wrap gap-3">
          <For each={primaryResources()}>
            {(resource) => (
              <a
                href={resource.url}
                class="siam-btn-secondary no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {resource.label} ({PROJECT_RESOURCE_TYPE_LABELS[resource.resourceType]})
              </a>
            )}
          </For>
        </div>
      </Show>

      <Show when={d().ownerRole}>
        <div class="mt-6">
          <h2 class="text-sm font-semibold text-ink">Owner role</h2>
          <p class="mt-1 text-sm text-secondary">{d().ownerRole}</p>
        </div>
      </Show>

      <Show when={d().ownerContribution}>
        <div class="mt-6">
          <h2 class="text-sm font-semibold text-ink">Contribution</h2>
          <p class="mt-1 whitespace-pre-wrap text-sm text-secondary">
            {d().ownerContribution}
          </p>
        </div>
      </Show>

      <Show when={sortedSections().length > 0}>
        <div class="mt-8 space-y-6">
          <h2 class="text-lg font-semibold text-ink">Case study</h2>
          <For each={sortedSections()}>
            {(section) => (
              <section>
                <h3 class="text-base font-semibold text-ink">
                  {section.kind === "custom" && section.title
                    ? section.title
                    : PROJECT_SECTION_KIND_LABELS[section.kind]}
                </h3>
                <p class="mt-2 whitespace-pre-wrap text-sm text-secondary">
                  {section.body}
                </p>
                <Show when={section.figures?.length}>
                  <div class="mt-4 space-y-4">
                    <For each={section.figures!}>
                      {(figure) => (
                        <Show when={(figure.alt?.trim() ?? "") !== ""}>
                          <figure>
                            <img
                              src={figure.url}
                              alt={figure.alt!.trim()}
                              loading="lazy"
                              decoding="async"
                              class="max-h-96 w-full rounded-lg border border-border object-contain"
                            />
                            <Show when={figure.caption?.trim()}>
                              <figcaption class="mt-2 text-sm text-ink-muted">
                                {figure.caption}
                              </figcaption>
                            </Show>
                          </figure>
                        </Show>
                      )}
                    </For>
                  </div>
                </Show>
              </section>
            )}
          </For>
        </div>
      </Show>

      <Show when={sortedMetrics().length > 0}>
        <div class="mt-8 overflow-x-auto">
          <h2 class="text-lg font-semibold text-ink">Metrics</h2>
          <figure class="mt-3">
            <table class="w-full min-w-[20rem] border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-border text-ink-muted">
                  <th scope="col" class="py-2 pr-4 font-medium">Metric</th>
                  <th scope="col" class="py-2 pr-4 font-medium">Value</th>
                  <th scope="col" class="py-2 pr-4 font-medium">Baseline</th>
                  <th scope="col" class="py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                <For each={sortedMetrics()}>
                  {(metric) => (
                    <tr class="border-b border-border/60">
                      <td class="py-2 pr-4 font-medium text-ink">{metric.name}</td>
                      <td class="py-2 pr-4 text-secondary">
                        {metric.value}
                        <Show when={metric.unit}>
                          <span class="text-ink-muted"> {metric.unit}</span>
                        </Show>
                      </td>
                      <td class="py-2 pr-4 text-secondary">
                        {metric.baseline ?? "—"}
                      </td>
                      <td class="py-2 text-secondary">{metric.notes ?? "—"}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
            <For each={metricsWithCaptions()}>
              {(metric) => (
                <figcaption class="mt-2 text-sm text-ink-muted">
                  <span class="font-medium text-ink">{metric.name}:</span>{" "}
                  {metric.caption}
                </figcaption>
              )}
            </For>
          </figure>
        </div>
      </Show>

      <Show
        when={
          d().related?.themes?.length || d().related?.publications?.length
        }
      >
        <div class="mt-10 space-y-8">
          <Show when={d().related!.themes.length > 0}>
            <section>
              <h2 class="text-lg font-semibold text-brand-deep">
                Related research themes
              </h2>
              <ul class="mt-4 list-none space-y-4 pl-0">
                <For each={d().related!.themes}>
                  {(theme) => (
                    <li class="rounded-lg border border-border p-4">
                      <A href={theme.href} class="text-link font-medium no-underline">
                        {theme.title}
                      </A>
                      <p class="mt-1 text-sm text-secondary">{theme.summary}</p>
                    </li>
                  )}
                </For>
              </ul>
            </section>
          </Show>
          <Show when={d().related!.publications.length > 0}>
            <section>
              <h2 class="text-lg font-semibold text-brand-deep">
                Related publications
              </h2>
              <ul class="mt-4 list-none space-y-4 pl-0">
                <For each={d().related!.publications}>
                  {(pub) => (
                    <li class="rounded-lg border border-border p-4">
                      <A href={pub.href} class="text-link font-medium no-underline">
                        {pub.title}
                      </A>
                      <p class="mt-1 text-sm text-ink-muted">
                        {pub.authorsShort} · {pub.venue} ({pub.year})
                      </p>
                      <Show when={pub.significance}>
                        <p class="mt-2 text-sm text-secondary">{pub.significance}</p>
                      </Show>
                    </li>
                  )}
                </For>
              </ul>
            </section>
          </Show>
        </div>
      </Show>

      <Show when={sortedResources().length > 0}>
        <div class="mt-8">
          <h2 class="text-lg font-semibold text-ink">Resources</h2>
          <ul class="mt-3 list-none space-y-2 pl-0">
            <For each={sortedResources()}>
              {(resource) => (
                <li>
                  <a
                    href={resource.url}
                    class="text-link font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.label}
                  </a>
                  <span class="ml-2 text-xs text-ink-muted">
                    ({PROJECT_RESOURCE_TYPE_LABELS[resource.resourceType]})
                  </span>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </DetailStubLayout>
  );
}
