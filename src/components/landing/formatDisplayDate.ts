export function formatDisplayDate(isoDate: string): string {
  const trimmed = isoDate.trim();
  const parsed = new Date(`${trimmed}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(parsed);
}
