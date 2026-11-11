import { useSubmission } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import AdminSiteContactPanel from "~/components/admin/site/AdminSiteContactPanel";
import AdminSiteContextCallout from "~/components/admin/site/AdminSiteContextCallout";
import AdminSiteGlobalPanel from "~/components/admin/site/AdminSiteGlobalPanel";
import AdminSiteHubIntrosPanel from "~/components/admin/site/AdminSiteHubIntrosPanel";
import AdminSiteNavigationPanel from "~/components/admin/site/AdminSiteNavigationPanel";
import { adminPagesApi } from "~/lib/api/endpoints/admin/pages.api";
import { adminSiteApi } from "~/lib/api/endpoints/admin/site.api";
import type { NavItemAdmin } from "~/lib/api/types/admin.types";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import {
  addNavItemAction,
  saveNavRowAction,
} from "~/lib/forms/actions/admin-site.actions";
import type { FormActionResult } from "~/lib/forms/types";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";

type SiteTabId = "global" | "hubs" | "contact" | "navigation";

function tabClass(active: boolean) {
  return `px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
    active
      ? "border-primary text-ink"
      : "border-transparent text-ink-muted hover:text-ink"
  }`;
}

export default function AdminSiteSettings() {
  const addNavSubmission = useSubmission(addNavItemAction);
  const navRowSubmission = useSubmission(saveNavRowAction);

  const [tab, setTab] = createSignal<SiteTabId>("global");
  const [loading, setLoading] = createSignal(true);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  const [dirtyGlobal, setDirtyGlobal] = createSignal(false);
  const [dirtyHubs, setDirtyHubs] = createSignal(false);
  const [dirtyContact, setDirtyContact] = createSignal(false);

  const [siteName, setSiteName] = createSignal("");
  const [defaultMetaDescription, setDefaultMetaDescription] = createSignal("");
  const [footerText, setFooterText] = createSignal("");
  const [researchHubIntro, setResearchHubIntro] = createSignal("");
  const [projectsHubIntro, setProjectsHubIntro] = createSignal("");
  const [writingHubIntro, setWritingHubIntro] = createSignal("");
  const [talksHubIntro, setTalksHubIntro] = createSignal("");
  const [collaborationsPageIntro, setCollaborationsPageIntro] =
    createSignal("");
  const [collaborationsPageEnabled, setCollaborationsPageEnabled] =
    createSignal(false);
  const [achievementsHubIntro, setAchievementsHubIntro] = createSignal("");
  const [experienceHubIntro, setExperienceHubIntro] = createSignal("");
  const [contactFormEnabled, setContactFormEnabled] = createSignal(true);
  const [contactPageIntro, setContactPageIntro] = createSignal("");
  const [contactCollaborationGuidance, setContactCollaborationGuidance] =
    createSignal("");
  const [contactResponseTimeNote, setContactResponseTimeNote] =
    createSignal("");
  const [contactCategories, setContactCategories] = createSignal<string[]>([]);
  const [contactConsentText, setContactConsentText] = createSignal("");
  const [contactSuccessMessage, setContactSuccessMessage] = createSignal("");
  const [contactPublicEmail, setContactPublicEmail] = createSignal("");
  const [contactShowEmailOnPage, setContactShowEmailOnPage] =
    createSignal(false);
  const [faviconUrl, setFaviconUrl] = createSignal("");
  const [faviconMediaId, setFaviconMediaId] = createSignal<string | null>(null);

  const [navItems, setNavItems] = createSignal<NavItemAdmin[]>([]);
  const [publishedSlugs, setPublishedSlugs] = createSignal<Set<string>>(
    new Set(),
  );

  const dirty = () => dirtyGlobal() || dirtyHubs() || dirtyContact();
  useUnsavedChanges(dirty);

  async function reloadNav() {
    const nav = await adminSiteApi.listNav();
    setNavItems(nav);
  }

  onMount(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [settings, nav, pages] = await Promise.all([
        adminSiteApi.getSettings(),
        adminSiteApi.listNav(),
        adminPagesApi.list(),
      ]);
      setSiteName(settings.siteName);
      setDefaultMetaDescription(settings.defaultMetaDescription ?? "");
      setFooterText(settings.footerText ?? "");
      setResearchHubIntro(settings.researchHubIntro ?? "");
      setProjectsHubIntro(settings.projectsHubIntro ?? "");
      setWritingHubIntro(settings.writingHubIntro ?? "");
      setTalksHubIntro(settings.talksHubIntro ?? "");
      setCollaborationsPageIntro(settings.collaborationsPageIntro ?? "");
      setCollaborationsPageEnabled(settings.collaborationsPageEnabled ?? false);
      setAchievementsHubIntro(settings.achievementsHubIntro ?? "");
      setExperienceHubIntro(settings.experienceHubIntro ?? "");
      setContactFormEnabled(settings.contactFormEnabled);
      setContactPageIntro(settings.contactPageIntro ?? "");
      setContactCollaborationGuidance(
        settings.contactCollaborationGuidance ?? "",
      );
      setContactResponseTimeNote(settings.contactResponseTimeNote ?? "");
      setContactCategories(
        settings.contactCategories?.length
          ? [...settings.contactCategories]
          : [],
      );
      setContactConsentText(settings.contactConsentText ?? "");
      setContactSuccessMessage(settings.contactSuccessMessage ?? "");
      setContactPublicEmail(settings.contactPublicEmail ?? "");
      setContactShowEmailOnPage(settings.contactShowEmailOnPage);
      setFaviconUrl(settings.faviconUrl ?? "");
      setFaviconMediaId(settings.faviconMediaId ?? null);
      setNavItems(nav);
      setPublishedSlugs(
        new Set(
          pages
            .filter((p) => p.publishStatus === "published")
            .map((p) => p.slug),
        ),
      );
    } catch (e) {
      setLoadError(getAuthFormErrorMessage(e).formMessage);
    } finally {
      setLoading(false);
    }
  });

  createEffect(() => {
    const r = addNavSubmission.result as FormActionResult | undefined;
    if (r?.ok) {
      void reloadNav();
    }
  });

  createEffect(() => {
    const r = navRowSubmission.result as FormActionResult | undefined;
    if (r?.ok) {
      void reloadNav();
    }
  });

  const clearGlobalDirty = () => setDirtyGlobal(false);
  const clearHubsDirty = () => setDirtyHubs(false);
  const clearContactDirty = () => setDirtyContact(false);

  return (
    <div class="max-w-4xl space-y-8">
      <Title>Site settings — SIAM Admin</Title>
      <AdminPageHeader
        title="Site settings"
        description="Global brand, navigation, listing-page intros, and contact page."
      />
      <AdminSiteContextCallout />
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={!loading() && !loadError()}>
        <div
          class="border-b border-border"
          role="tablist"
          aria-label="Site settings sections"
        >
          <div class="flex flex-wrap gap-1">
            <button
              type="button"
              role="tab"
              aria-selected={tab() === "global"}
              class={tabClass(tab() === "global")}
              onClick={() => setTab("global")}
            >
              Global
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab() === "hubs"}
              class={tabClass(tab() === "hubs")}
              onClick={() => setTab("hubs")}
            >
              Page intros
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab() === "contact"}
              class={tabClass(tab() === "contact")}
              onClick={() => setTab("contact")}
            >
              Contact
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab() === "navigation"}
              class={tabClass(tab() === "navigation")}
              onClick={() => setTab("navigation")}
            >
              Navigation
            </button>
          </div>
        </div>
        <div class="pt-6">
          <Show when={tab() === "global"}>
            <AdminSiteGlobalPanel
              siteName={siteName()}
              setSiteName={setSiteName}
              defaultMetaDescription={defaultMetaDescription()}
              setDefaultMetaDescription={setDefaultMetaDescription}
              footerText={footerText()}
              setFooterText={setFooterText}
              faviconUrl={faviconUrl()}
              setFaviconUrl={setFaviconUrl}
              faviconMediaId={faviconMediaId()}
              setFaviconMediaId={setFaviconMediaId}
              onDirty={() => setDirtyGlobal(true)}
              onSaved={clearGlobalDirty}
            />
          </Show>
          <Show when={tab() === "hubs"}>
            <AdminSiteHubIntrosPanel
              researchHubIntro={researchHubIntro()}
              setResearchHubIntro={setResearchHubIntro}
              projectsHubIntro={projectsHubIntro()}
              setProjectsHubIntro={setProjectsHubIntro}
              writingHubIntro={writingHubIntro()}
              setWritingHubIntro={setWritingHubIntro}
              talksHubIntro={talksHubIntro()}
              setTalksHubIntro={setTalksHubIntro}
              collaborationsPageIntro={collaborationsPageIntro()}
              setCollaborationsPageIntro={setCollaborationsPageIntro}
              collaborationsPageEnabled={collaborationsPageEnabled()}
              setCollaborationsPageEnabled={setCollaborationsPageEnabled}
              achievementsHubIntro={achievementsHubIntro()}
              setAchievementsHubIntro={setAchievementsHubIntro}
              experienceHubIntro={experienceHubIntro()}
              setExperienceHubIntro={setExperienceHubIntro}
              onDirty={() => setDirtyHubs(true)}
              onSaved={clearHubsDirty}
            />
          </Show>
          <Show when={tab() === "contact"}>
            <AdminSiteContactPanel
              contactFormEnabled={contactFormEnabled()}
              setContactFormEnabled={setContactFormEnabled}
              contactPageIntro={contactPageIntro()}
              setContactPageIntro={setContactPageIntro}
              contactCollaborationGuidance={contactCollaborationGuidance()}
              setContactCollaborationGuidance={setContactCollaborationGuidance}
              contactResponseTimeNote={contactResponseTimeNote()}
              setContactResponseTimeNote={setContactResponseTimeNote}
              contactCategories={contactCategories()}
              setContactCategories={setContactCategories}
              contactConsentText={contactConsentText()}
              setContactConsentText={setContactConsentText}
              contactSuccessMessage={contactSuccessMessage()}
              setContactSuccessMessage={setContactSuccessMessage}
              contactPublicEmail={contactPublicEmail()}
              setContactPublicEmail={setContactPublicEmail}
              contactShowEmailOnPage={contactShowEmailOnPage()}
              setContactShowEmailOnPage={setContactShowEmailOnPage}
              onDirty={() => setDirtyContact(true)}
              onSaved={clearContactDirty}
            />
          </Show>
          <Show when={tab() === "navigation"}>
            <AdminSiteNavigationPanel
              navItems={navItems()}
              setNavItems={setNavItems}
              publishedSlugs={publishedSlugs()}
            />
          </Show>
        </div>
      </Show>
    </div>
  );
}
