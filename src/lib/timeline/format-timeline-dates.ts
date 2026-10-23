export function formatTimelineDateRange(
  startDate: string | null,
  endDate: string | null,
  isOngoing: boolean,
): string {
  const start = formatMonthLabel(startDate);
  const end = isOngoing ? "Present" : formatMonthLabel(endDate);
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;
  return "—";
}

function formatMonthLabel(isoDate: string | null): string | null {
  if (!isoDate?.trim()) return null;
  const d = new Date(isoDate.includes("T") ? isoDate : `${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

/** Month input value YYYY-MM from stored date (day 1). */
export function monthInputFromDate(isoDate: string | null): string {
  if (!isoDate?.trim()) return "";
  const match = /^(\d{4}-\d{2})/.exec(isoDate);
  return match ? match[1] : "";
}

/** Store as YYYY-MM-01 for domain month precision. */
export function dateFromMonthInput(month: string): string | null {
  const trimmed = month.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}$/.test(trimmed)) return `${trimmed}-01`;
  return trimmed;
}
