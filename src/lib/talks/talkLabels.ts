import type { AcademicServiceType, TalkRole, TalkType } from "~/lib/api/types/talks.types";

export const TALK_ROLES: TalkRole[] = [
  "speaker",
  "panelist",
  "poster_presenter",
  "attendee",
  "organizer",
];

export const TALK_TYPES: TalkType[] = [
  "invited_talk",
  "conference_talk",
  "poster",
  "workshop",
  "other",
];

export const ACADEMIC_SERVICE_TYPES: AcademicServiceType[] = [
  "reviewing",
  "committee",
  "mentoring",
  "outreach",
  "editorial",
  "other",
];

export const TALK_ROLE_LABELS: Record<TalkRole, string> = {
  speaker: "Speaker",
  panelist: "Panelist",
  poster_presenter: "Poster presenter",
  attendee: "Attendee",
  organizer: "Organizer",
};

export const TALK_TYPE_LABELS: Record<TalkType, string> = {
  invited_talk: "Invited talk",
  conference_talk: "Conference talk",
  poster: "Poster",
  workshop: "Workshop",
  other: "Other",
};

export const ACADEMIC_SERVICE_TYPE_LABELS: Record<AcademicServiceType, string> = {
  reviewing: "Reviewing",
  committee: "Committee",
  mentoring: "Mentoring",
  outreach: "Outreach",
  editorial: "Editorial",
  other: "Other",
};

export const TALK_RESOURCE_TYPE_LABELS = {
  slides: "Slides",
  video: "Video",
  poster: "Poster",
  event_page: "Event page",
  other: "Other",
} as const;
