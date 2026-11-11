import { z } from "zod";
import type { TalkAdminDetail } from "~/lib/api/types/talks.types";
import {
  TALK_ROLES,
  TALK_TYPES,
} from "~/lib/talks/talkLabels";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const talkWriteSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required").max(500),
  eventName: z.string().min(1, "Event name is required").max(500),
  timezone: z.string().min(1, "Timezone is required").max(100),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: z.string().nullable().optional(),
  venue: z.string().max(500).nullable().optional(),
  location: z.string().max(500).nullable().optional(),
  isOnline: z.boolean().optional(),
  role: z.enum(TALK_ROLES as [string, ...string[]]).optional(),
  talkType: z.enum(TALK_TYPES as [string, ...string[]]).optional(),
  description: z.string().max(10_000).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(10_000).optional(),
  hideFromSearch: z.boolean().optional(),
});

export type TalkWriteInput = z.infer<typeof talkWriteSchema>;

export function emptyTalkDraft(): TalkWriteInput {
  return {
    slug: "",
    title: "",
    eventName: "",
    timezone: "UTC",
    startsAt: new Date().toISOString(),
    endsAt: null,
    venue: null,
    location: null,
    isOnline: false,
    role: "speaker",
    talkType: "conference_talk",
    description: null,
    sortOrder: 0,
    hideFromSearch: false,
  };
}

export function talkDraftFromAdmin(detail: TalkAdminDetail): TalkWriteInput {
  return {
    slug: detail.slug,
    title: detail.title,
    eventName: detail.eventName,
    timezone: detail.timezone,
    startsAt: detail.startsAt,
    endsAt: detail.endsAt,
    venue: detail.venue,
    location: detail.location,
    isOnline: detail.isOnline,
    role: detail.role,
    talkType: detail.talkType,
    description: detail.description,
    sortOrder: detail.sortOrder,
    hideFromSearch: detail.hideFromSearch,
  };
}

export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) {
      out[key] = issue.message;
    }
  }
  return out;
}
