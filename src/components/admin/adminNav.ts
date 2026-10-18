export type AdminNavItem = {
  href: string;
  label: string;
  /** Match only exact path (e.g. dashboard `/admin`). */
  end?: boolean;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", end: true },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/site", label: "Site" },
];

export function isAdminNavActive(pathname: string, item: AdminNavItem): boolean {
  if (item.end) {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
