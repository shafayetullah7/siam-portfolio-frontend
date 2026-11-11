/** Public-style preview of talk start time in a given IANA timezone. */
export function formatTalkDateTimePreview(
  startsAtIso: string,
  timezone: string,
): string | null {
  const parsed = new Date(startsAtIso);
  if (Number.isNaN(parsed.getTime()) || !timezone.trim()) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone.trim(),
    }).format(parsed);
  } catch {
    return null;
  }
}

export type TalkDateTimeDisplay = {
  formatted: string;
  timezoneLabel: string;
};

/** Card-friendly date/time line with a short timezone label for muted UI copy. */
export function formatTalkDateTime(
  startsAtIso: string,
  timezone: string,
): TalkDateTimeDisplay | null {
  const formatted = formatTalkDateTimePreview(startsAtIso, timezone);
  if (!formatted) return null;
  const tz = timezone.trim();
  let timezoneLabel = tz;
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(new Date(startsAtIso));
    const short = parts.find((p) => p.type === "timeZoneName")?.value;
    if (short) timezoneLabel = short;
  } catch {
  }
  return { formatted, timezoneLabel };
}
