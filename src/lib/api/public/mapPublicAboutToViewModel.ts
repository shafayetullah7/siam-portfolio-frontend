import type { PublicAboutPayload } from "../endpoints/public/site.api";
import type { ProfileExpertise } from "../types/home.types";
import type { HomeProfileLink } from "~/content/home.types";

export type AboutAffiliation = {
  role: string | null;
  organization: string | null;
  location: string | null;
  legacyLine: string | null;
};

export type AboutPageViewModel = {
  published: boolean;
  title: string;
  professionalTitle: string | null;
  shortBio: string | null;
  longBio: string | null;
  affiliation: AboutAffiliation | null;
  researchStatement: string | null;
  expertise: ProfileExpertise | null;
  scholarlyProfiles: readonly HomeProfileLink[];
  collaborationInterests: string | null;
  contactEmail: string | null;
  showIntro: boolean;
  showAffiliation: boolean;
  showStatement: boolean;
  showExpertise: boolean;
  showScholarly: boolean;
  showCollaboration: boolean;
};

const EMPTY_VIEW: AboutPageViewModel = {
  published: false,
  title: "",
  professionalTitle: null,
  shortBio: null,
  longBio: null,
  affiliation: null,
  researchStatement: null,
  expertise: null,
  scholarlyProfiles: [],
  collaborationInterests: null,
  contactEmail: null,
  showIntro: false,
  showAffiliation: false,
  showStatement: false,
  showExpertise: false,
  showScholarly: false,
  showCollaboration: false,
};

function hasExpertise(expertise: ProfileExpertise | null | undefined): boolean {
  if (!expertise) return false;
  return (
    expertise.domains.length > 0 ||
    expertise.methodologies.length > 0 ||
    expertise.tooling.length > 0 ||
    expertise.practices.length > 0
  );
}

export function mapPublicAboutToViewModel(
  api: PublicAboutPayload | undefined,
): AboutPageViewModel {
  if (!api?.published) {
    return { ...EMPTY_VIEW };
  }

  const title =
    api.displayName?.trim() || api.headline?.trim() || "About";
  const professionalTitle = api.professionalTitle?.trim() || null;
  const shortBio = api.shortBio?.trim() || null;
  const longBio = api.longBio?.trim() || null;
  const researchStatement = api.researchStatement?.trim() || null;
  const collaborationInterests = api.collaborationInterests?.trim() || null;
  const contactEmail = api.contactEmail?.trim() || null;
  const scholarlyProfiles = (api.scholarlyProfiles ?? []).filter(
    (p) => p.label?.trim() && p.href?.trim(),
  );

  const structured =
    api.affiliationRole?.trim() ||
    api.affiliationOrganization?.trim() ||
    api.affiliationLocation?.trim();
  const legacyLine = api.affiliation?.trim() || null;

  let affiliation: AboutAffiliation | null = null;
  if (structured) {
    affiliation = {
      role: api.affiliationRole?.trim() || null,
      organization: api.affiliationOrganization?.trim() || null,
      location: api.affiliationLocation?.trim() || null,
      legacyLine: null,
    };
  } else if (legacyLine) {
    affiliation = {
      role: null,
      organization: null,
      location: null,
      legacyLine,
    };
  }

  const expertise = hasExpertise(api.expertise) ? api.expertise! : null;

  const showIntro = Boolean(
    title || professionalTitle || shortBio || longBio,
  );
  const showAffiliation = Boolean(affiliation);
  const showStatement = Boolean(researchStatement);
  const showExpertise = Boolean(expertise);
  const showScholarly = scholarlyProfiles.length > 0;
  const showCollaboration = Boolean(collaborationInterests || contactEmail);

  return {
    published: true,
    title,
    professionalTitle,
    shortBio,
    longBio,
    affiliation,
    researchStatement,
    expertise,
    scholarlyProfiles,
    collaborationInterests,
    contactEmail,
    showIntro,
    showAffiliation,
    showStatement,
    showExpertise,
    showScholarly,
    showCollaboration,
  };
}
