const FALLBACK_TIME_ZONES = [
  "UTC",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Asia/Dhaka",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export function ianaTimeZoneOptions(): string[] {
  if (
    typeof Intl !== "undefined" &&
    "supportedValuesOf" in Intl &&
    typeof Intl.supportedValuesOf === "function"
  ) {
    try {
      return [...Intl.supportedValuesOf("timeZone")].sort();
    } catch {
      return [...FALLBACK_TIME_ZONES];
    }
  }
  return [...FALLBACK_TIME_ZONES];
}
