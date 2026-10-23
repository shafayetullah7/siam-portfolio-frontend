/**
 * Admin sidebar IA — maps to AI_ML_Portfolio requirements A02–A12.
 * Set `status: "active"` when the route under `href` is implemented.
 */
export type AdminNavStatus = "active" | "comingSoon";

export type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  end?: boolean;
  status: AdminNavStatus;
  requirement?: string;
};

export type AdminNavSection = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/admin",
        end: true,
        status: "active",
        requirement: "A02",
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    items: [
      {
        id: "home",
        label: "Home",
        href: "/admin/home",
        status: "comingSoon",
        requirement: "A03",
      },
      {
        id: "research",
        label: "Research",
        href: "/admin/research",
        status: "active",
        requirement: "A04",
      },
      {
        id: "publications",
        label: "Publications",
        href: "/admin/publications",
        status: "active",
        requirement: "A05",
      },
      {
        id: "projects",
        label: "Projects",
        href: "/admin/projects",
        status: "active",
        requirement: "A06",
      },
      {
        id: "writing",
        label: "Writing",
        href: "/admin/writing",
        status: "active",
        requirement: "A08",
      },
      {
        id: "pages",
        label: "Pages",
        href: "/admin/pages",
        status: "active",
      },
    ],
  },
  {
    id: "library",
    label: "Library & inbox",
    items: [
      {
        id: "media",
        label: "Media",
        href: "/admin/media",
        status: "active",
        requirement: "A10",
      },
      {
        id: "messages",
        label: "Messages",
        href: "/admin/messages",
        status: "active",
        requirement: "A11",
      },
    ],
  },
  {
    id: "site",
    label: "Site",
    items: [
      {
        id: "site-settings",
        label: "Site settings",
        href: "/admin/site",
        status: "active",
        requirement: "A12",
      },
    ],
  },
  {
    id: "more",
    label: "More",
    items: [
      {
        id: "achievements",
        label: "Achievements & timeline",
        href: "/admin/achievements",
        status: "active",
        requirement: "A07",
      },
      {
        id: "talks",
        label: "Talks & service",
        href: "/admin/talks",
        status: "comingSoon",
        requirement: "A09",
      },
    ],
  },
];

export function getActiveAdminNavItems(): AdminNavItem[] {
  return ADMIN_NAV_SECTIONS.flatMap((section) =>
    section.items.filter((item) => item.status === "active"),
  );
}

export function isAdminNavActive(pathname: string, item: AdminNavItem): boolean {
  if (item.status !== "active") return false;
  if (item.end) {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function isAdminRouteImplemented(pathname: string): boolean {
  return getActiveAdminNavItems().some((item) => isAdminNavActive(pathname, item));
}
