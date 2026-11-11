import { Show } from "solid-js";
import DetailStubLayout from "~/components/catalog/DetailStubLayout";
import type { TalkPublicDetail } from "~/lib/api/types/talks.types";
import { formatTalkDateTime } from "~/lib/talks/formatTalkDateTime";
import { TALK_ROLE_LABELS, TALK_TYPE_LABELS } from "~/lib/talks/talkLabels";
import TalkMaterialsList from "./TalkMaterialsList";
import TalkRelatedSection from "./TalkRelatedSection";

export type TalkPublicDetailViewProps = {
  detail: TalkPublicDetail;
  backHref: string;
  backLabel: string;
};

function locationLine(detail: TalkPublicDetail): string | null {
  if (detail.isOnline) {
    const venue = detail.venue?.trim();
    return venue ? `Online · ${venue}` : "Online";
  }
  const parts = [detail.location?.trim(), detail.venue?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export default function TalkPublicDetailView(props: TalkPublicDetailViewProps) {
  const d = () => props.detail;
  const when = () => formatTalkDateTime(d().startsAt, d().timezone);

  const metaLines = () => {
    const lines = [
      `${TALK_TYPE_LABELS[d().talkType]} · ${TALK_ROLE_LABELS[d().role]}`,
      d().eventName,
    ];
    const w = when();
    if (w) lines.push(`${w.formatted} (${w.timezoneLabel})`);
    const loc = locationLine(d());
    if (loc) lines.push(loc);
    return lines;
  };

  const body = () => d().description?.trim() ?? "";

  return (
    <DetailStubLayout
      title={d().title}
      backHref={props.backHref}
      backLabel={props.backLabel}
      metaLines={metaLines()}
      relatedLinks={[
        { label: "Publications", href: "/publications" },
        { label: "Projects", href: "/projects" },
        { label: "Research", href: "/research" },
      ]}
    >
      <Show when={body()}>
        <div class="mt-6 whitespace-pre-wrap text-secondary">{body()}</div>
      </Show>
      <TalkMaterialsList resources={d().resources} />
      <TalkRelatedSection related={d().related} />
    </DetailStubLayout>
  );
}
