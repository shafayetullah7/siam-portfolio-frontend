import { Title } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import HomePublishControls from "~/components/admin/home/HomePublishControls";
import AdminHomeCompositionPanel, {
  type CompositionFormState,
} from "~/components/admin/home/AdminHomeCompositionPanel";
import AdminHomeIdentityPanel, {
  type IdentityFormState,
} from "~/components/admin/home/AdminHomeIdentityPanel";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import { adminHomeApi } from "~/lib/api/endpoints/admin/home.api";
import { adminProfileApi } from "~/lib/api/endpoints/admin/profile.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type {
  HomeAdminAggregate,
  HomeFeaturedSummaryResponse,
  HomepageAdmin,
  ProfileAdmin,
  UpdateHomepageBody,
  UpdateProfileBody,
} from "~/lib/api/types/home.types";
import { mapAdminMutationError } from "~/lib/forms/mapAdminMutationError";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import {
  coerceEditorSections,
  defaultHomeSections,
} from "~/lib/home/admin-home-sections";
import {
  EMPTY_EXPERTISE_LINES,
  expertiseToLines,
  linesToExpertise,
} from "~/lib/profile/expertise-form";

type TabId = "composition" | "identity";

function nullToEmpty(value: string | null | undefined): string {
  return value ?? "";
}

function homepageToComposition(homepage: HomepageAdmin): CompositionFormState {
  return {
    heroTitle: nullToEmpty(homepage.heroTitle),
    heroSubtitle: nullToEmpty(homepage.heroSubtitle),
    heroDescriptor: nullToEmpty(homepage.heroDescriptor),
    heroPositioning: nullToEmpty(homepage.heroPositioning),
    statusBadge: nullToEmpty(homepage.statusBadge),
    primaryCtaLabel: nullToEmpty(homepage.primaryCtaLabel),
    primaryCtaHref: nullToEmpty(homepage.primaryCtaHref),
    secondaryCtaLabel: nullToEmpty(homepage.secondaryCtaLabel),
    secondaryCtaHref: nullToEmpty(homepage.secondaryCtaHref),
    seoTitle: nullToEmpty(homepage.seoTitle),
    seoDescription: nullToEmpty(homepage.seoDescription),
    sections: coerceEditorSections(homepage.sections),
    heroMediaId: homepage.heroMediaId,
  };
}

function profileToIdentity(profile: ProfileAdmin): IdentityFormState {
  return {
    displayName: nullToEmpty(profile.displayName),
    professionalTitle: nullToEmpty(profile.professionalTitle),
    headline: nullToEmpty(profile.headline),
    contactEmail: nullToEmpty(profile.contactEmail),
    affiliation: nullToEmpty(profile.affiliation),
    affiliationRole: nullToEmpty(profile.affiliationRole),
    affiliationOrganization: nullToEmpty(profile.affiliationOrganization),
    affiliationLocation: nullToEmpty(profile.affiliationLocation),
    shortBio: nullToEmpty(profile.shortBio),
    longBio: nullToEmpty(profile.longBio),
    researchStatement: nullToEmpty(profile.researchStatement),
    expertiseLines: expertiseToLines(profile.expertise),
    collaborationInterests: nullToEmpty(profile.collaborationInterests),
    scholarlyProfiles: profile.scholarlyProfiles
      ? [...profile.scholarlyProfiles]
      : [],
    portraitMediaId: profile.portraitMediaId,
  };
}

function emptyToNull(value: string): string | null {
  const t = value.trim();
  return t === "" ? null : t;
}

function compositionToUpdateBody(form: CompositionFormState): UpdateHomepageBody {
  return {
    heroTitle: emptyToNull(form.heroTitle),
    heroSubtitle: emptyToNull(form.heroSubtitle),
    heroDescriptor: emptyToNull(form.heroDescriptor),
    heroPositioning: emptyToNull(form.heroPositioning),
    statusBadge: emptyToNull(form.statusBadge),
    primaryCtaLabel: emptyToNull(form.primaryCtaLabel),
    primaryCtaHref: emptyToNull(form.primaryCtaHref),
    secondaryCtaLabel: emptyToNull(form.secondaryCtaLabel),
    secondaryCtaHref: emptyToNull(form.secondaryCtaHref),
    seoTitle: emptyToNull(form.seoTitle),
    seoDescription: emptyToNull(form.seoDescription),
    sections: form.sections,
    heroMediaId: form.heroMediaId,
  };
}

function identityToUpdateBody(form: IdentityFormState): UpdateProfileBody {
  const profiles =
    form.scholarlyProfiles.length > 0
      ? form.scholarlyProfiles
          .map((p) => ({
            label: p.label.trim(),
            href: p.href.trim(),
            subtitle: p.subtitle?.trim() || undefined,
          }))
          .filter((p) => p.label || p.href)
      : null;

  return {
    displayName: emptyToNull(form.displayName),
    professionalTitle: emptyToNull(form.professionalTitle),
    headline: emptyToNull(form.headline),
    contactEmail: emptyToNull(form.contactEmail),
    affiliation: emptyToNull(form.affiliation),
    affiliationRole: emptyToNull(form.affiliationRole),
    affiliationOrganization: emptyToNull(form.affiliationOrganization),
    affiliationLocation: emptyToNull(form.affiliationLocation),
    shortBio: emptyToNull(form.shortBio),
    longBio: emptyToNull(form.longBio),
    researchStatement: emptyToNull(form.researchStatement),
    expertise: linesToExpertise(form.expertiseLines),
    collaborationInterests: emptyToNull(form.collaborationInterests),
    scholarlyProfiles: profiles,
    portraitMediaId: form.portraitMediaId,
  };
}

export default function AdminHomeEditor() {
  const [tab, setTab] = createSignal<TabId>("composition");
  const [loading, setLoading] = createSignal(true);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [dirty, setDirty] = createSignal(false);
  const [profileStatus, setProfileStatus] = createSignal<ProfileAdmin["publishStatus"]>("draft");
  const [homepageStatus, setHomepageStatus] =
    createSignal<HomepageAdmin["publishStatus"]>("draft");

  const [composition, setComposition] = createSignal<CompositionFormState>({
    heroTitle: "",
    heroSubtitle: "",
    heroDescriptor: "",
    heroPositioning: "",
    statusBadge: "",
    primaryCtaLabel: "",
    primaryCtaHref: "",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    seoTitle: "",
    seoDescription: "",
    sections: defaultHomeSections(),
    heroMediaId: null,
  });
  const [identity, setIdentity] = createSignal<IdentityFormState>({
    displayName: "",
    professionalTitle: "",
    headline: "",
    contactEmail: "",
    affiliation: "",
    affiliationRole: "",
    affiliationOrganization: "",
    affiliationLocation: "",
    shortBio: "",
    longBio: "",
    researchStatement: "",
    expertiseLines: { ...EMPTY_EXPERTISE_LINES },
    collaborationInterests: "",
    scholarlyProfiles: [],
    portraitMediaId: null,
  });

  const [compositionSaving, setCompositionSaving] = createSignal(false);
  const [identitySaving, setIdentitySaving] = createSignal(false);
  const [compositionMessage, setCompositionMessage] = createSignal<string | null>(
    null,
  );
  const [identityMessage, setIdentityMessage] = createSignal<string | null>(null);
  const [compositionSuccess, setCompositionSuccess] = createSignal(false);
  const [identitySuccess, setIdentitySuccess] = createSignal(false);
  const [compositionFieldErrors, setCompositionFieldErrors] = createSignal<
    Record<string, string>
  >({});
  const [identityFieldErrors, setIdentityFieldErrors] = createSignal<
    Record<string, string>
  >({});
  const [featuredSummary, setFeaturedSummary] =
    createSignal<HomeFeaturedSummaryResponse | undefined>(undefined);
  const [featuredSummaryLoading, setFeaturedSummaryLoading] =
    createSignal(true);

  useUnsavedChanges(dirty);

  async function loadFeaturedSummary() {
    setFeaturedSummaryLoading(true);
    try {
      setFeaturedSummary(await adminHomeApi.featuredSummary());
    } catch {
      setFeaturedSummary(undefined);
    } finally {
      setFeaturedSummaryLoading(false);
    }
  }

  function applyAggregate(data: HomeAdminAggregate) {
    setComposition(homepageToComposition(data.homepage));
    setIdentity(profileToIdentity(data.profile));
    setProfileStatus(data.profile.publishStatus);
    setHomepageStatus(data.homepage.publishStatus);
  }

  onMount(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminHomeApi.getAggregate();
      applyAggregate(data);
      void loadFeaturedSummary();
    } catch (e) {
      setLoadError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  });

  function markDirty() {
    setDirty(true);
    setCompositionSuccess(false);
    setIdentitySuccess(false);
  }

  async function saveComposition(e: Event) {
    e.preventDefault();
    setCompositionSaving(true);
    setCompositionMessage(null);
    setCompositionFieldErrors({});
    setCompositionSuccess(false);
    try {
      const updated = await adminHomeApi.update(
        compositionToUpdateBody(composition()),
      );
      setComposition(homepageToComposition(updated));
      setHomepageStatus(updated.publishStatus);
      setDirty(false);
      setCompositionSuccess(true);
    } catch (error) {
      const { formMessage, fieldErrors } = mapAdminMutationError(error);
      setCompositionMessage(formMessage);
      setCompositionFieldErrors(fieldErrors);
    } finally {
      setCompositionSaving(false);
    }
  }

  async function saveIdentity(e: Event) {
    e.preventDefault();
    setIdentitySaving(true);
    setIdentityMessage(null);
    setIdentityFieldErrors({});
    setIdentitySuccess(false);
    try {
      const updated = await adminProfileApi.update(
        identityToUpdateBody(identity()),
      );
      setIdentity(profileToIdentity(updated));
      setProfileStatus(updated.publishStatus);
      setDirty(false);
      setIdentitySuccess(true);
    } catch (error) {
      const { formMessage, fieldErrors } = mapAdminMutationError(error);
      setIdentityMessage(formMessage);
      setIdentityFieldErrors(fieldErrors);
    } finally {
      setIdentitySaving(false);
    }
  }

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
      active
        ? "border-primary text-ink"
        : "border-transparent text-ink-muted hover:text-ink"
    }`;

  return (
    <div>
      <Title>Home — SIAM Admin</Title>
      <AdminPageHeader
        title="Home"
        description="Landing page composition and global identity (A03)."
      >
        <div class="flex flex-wrap items-end gap-4">
          <Show when={!loading() && !loadError()}>
            <div class="flex items-center gap-2">
              <PublishStatusBadge status={homepageStatus()} />
              <HomePublishControls
                target="homepage"
                label="Homepage"
                publishStatus={homepageStatus()}
                onHomepageUpdated={(row) => {
                  setHomepageStatus(row.publishStatus);
                  void loadFeaturedSummary();
                }}
              />
            </div>
            <div class="flex items-center gap-2">
              <PublishStatusBadge status={profileStatus()} />
              <HomePublishControls
                target="profile"
                label="Profile"
                publishStatus={profileStatus()}
                onProfileUpdated={(row) => setProfileStatus(row.publishStatus)}
              />
            </div>
            <a
              href="/admin/home/preview"
              class="text-sm text-primary no-underline hover:underline"
            >
              Preview home
            </a>
          </Show>
        </div>
      </AdminPageHeader>

      <Show when={loading()}>
        <p class="mt-6 text-sm text-ink-muted">Loading…</p>
      </Show>

      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>

      <Show when={!loading() && !loadError()}>
        <div class="mt-6 flex gap-2 border-b border-border">
          <button
            type="button"
            class={tabClass(tab() === "composition")}
            onClick={() => setTab("composition")}
          >
            Composition
          </button>
          <button
            type="button"
            class={tabClass(tab() === "identity")}
            onClick={() => setTab("identity")}
          >
            Identity
          </button>
        </div>

        <Show when={tab() === "composition"}>
          <AdminHomeCompositionPanel
            form={composition()}
            onChange={(patch) => setComposition((prev) => ({ ...prev, ...patch }))}
            onDirty={markDirty}
            onSubmit={saveComposition}
            saving={compositionSaving()}
            fieldErrors={compositionFieldErrors()}
            featuredSummary={featuredSummary()}
            featuredSummaryLoading={featuredSummaryLoading()}
            footer={
              <>
                <FormErrorAlert message={compositionMessage()} />
                <FormSuccessNotice
                  message={
                    compositionSuccess() ? "Composition saved." : null
                  }
                />
              </>
            }
          />
        </Show>

        <Show when={tab() === "identity"}>
          <AdminHomeIdentityPanel
            form={identity()}
            onChange={(patch) => setIdentity((prev) => ({ ...prev, ...patch }))}
            onDirty={markDirty}
            onSubmit={saveIdentity}
            saving={identitySaving()}
            fieldErrors={identityFieldErrors()}
            footer={
              <>
                <FormErrorAlert message={identityMessage()} />
                <FormSuccessNotice
                  message={identitySuccess() ? "Identity saved." : null}
                />
              </>
            }
          />
        </Show>
      </Show>
    </div>
  );
}
