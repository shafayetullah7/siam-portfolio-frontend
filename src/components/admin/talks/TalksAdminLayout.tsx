import { A, useLocation, type RouteSectionProps } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import AdminPageHeader from "~/components/admin/AdminPageHeader";

type TabId = "talks" | "collaborations" | "service";

function activeTab(pathname: string): TabId {
  if (pathname.startsWith("/admin/talks/collaborations")) return "collaborations";
  if (pathname.startsWith("/admin/talks/service")) return "service";
  return "talks";
}

function tabClass(active: boolean): string {
  return `px-4 py-2 text-sm font-medium border-b-2 -mb-px no-underline ${
    active
      ? "border-primary text-ink"
      : "border-transparent text-ink-muted hover:text-ink"
  }`;
}

export default function TalksAdminLayout(props: RouteSectionProps) {
  const location = useLocation();
  const tab = () => activeTab(location.pathname);

  return (
    <div>
      <Title>Talks & service — SIAM Admin</Title>
      <AdminPageHeader
        title="Talks & service"
        description="Talks, collaborations, and academic service (A09)."
      />
      <nav
        class="mt-6 flex gap-2 border-b border-border"
        aria-label="Talks manager sections"
      >
        <A href="/admin/talks" class={tabClass(tab() === "talks")}>
          Talks
        </A>
        <A
          href="/admin/talks/collaborations"
          class={tabClass(tab() === "collaborations")}
        >
          Collaborations
        </A>
        <A href="/admin/talks/service" class={tabClass(tab() === "service")}>
          Academic service
        </A>
      </nav>
      <div class="mt-6">
        {props.children}
      </div>
    </div>
  );
}
