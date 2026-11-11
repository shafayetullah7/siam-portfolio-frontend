import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import AdminSiteHubIntroCard from "./AdminSiteHubIntroCard";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import FormTextarea from "~/components/forms/FormTextarea";
import { emptyToNull } from "~/lib/admin/site/site-settings-form";
import { saveSiteSettingsPanel } from "~/lib/admin/site/saveSiteSettingsPanel";

export type AdminSiteHubIntrosPanelProps = {
  researchHubIntro: string;
  setResearchHubIntro: (v: string) => void;
  projectsHubIntro: string;
  setProjectsHubIntro: (v: string) => void;
  writingHubIntro: string;
  setWritingHubIntro: (v: string) => void;
  talksHubIntro: string;
  setTalksHubIntro: (v: string) => void;
  collaborationsPageIntro: string;
  setCollaborationsPageIntro: (v: string) => void;
  collaborationsPageEnabled: boolean;
  setCollaborationsPageEnabled: (v: boolean) => void;
  achievementsHubIntro: string;
  setAchievementsHubIntro: (v: string) => void;
  experienceHubIntro: string;
  setExperienceHubIntro: (v: string) => void;
  onDirty: () => void;
  onSaved: () => void;
};

export default function AdminSiteHubIntrosPanel(props: AdminSiteHubIntrosPanelProps) {
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal(false);

  function mark() {
    props.onDirty();
    setSuccess(false);
  }

  async function handleSave(e: Event) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setSuccess(false);
    const result = await saveSiteSettingsPanel("hubs", {
      researchHubIntro: emptyToNull(props.researchHubIntro),
      projectsHubIntro: emptyToNull(props.projectsHubIntro),
      writingHubIntro: emptyToNull(props.writingHubIntro),
      talksHubIntro: emptyToNull(props.talksHubIntro),
      collaborationsPageIntro: emptyToNull(props.collaborationsPageIntro),
      collaborationsPageEnabled: props.collaborationsPageEnabled,
      achievementsHubIntro: emptyToNull(props.achievementsHubIntro),
      experienceHubIntro: emptyToNull(props.experienceHubIntro),
    });
    setSaving(false);
    if (result.ok) {
      setSuccess(true);
      props.onSaved();
      return;
    }
    setMessage(result.formMessage);
  }

  return (
    <form class="space-y-4" onSubmit={handleSave}>
      <p class="text-sm text-ink-muted">
        Short introductions at the top of public listing and hub pages. Leave blank
        to omit the intro block.
      </p>
      <div class="space-y-4">
        <AdminSiteHubIntroCard
          title="Research"
          publicPath="/research"
          name="researchHubIntro"
          value={props.researchHubIntro}
          onInput={(v) => {
            props.setResearchHubIntro(v);
            mark();
          }}
        />
        <AdminSiteHubIntroCard
          title="Projects"
          publicPath="/projects"
          name="projectsHubIntro"
          value={props.projectsHubIntro}
          onInput={(v) => {
            props.setProjectsHubIntro(v);
            mark();
          }}
        />
        <AdminSiteHubIntroCard
          title="Writing"
          publicPath="/writing"
          name="writingHubIntro"
          value={props.writingHubIntro}
          onInput={(v) => {
            props.setWritingHubIntro(v);
            mark();
          }}
        />
        <AdminSiteHubIntroCard
          title="Talks"
          publicPath="/talks"
          name="talksHubIntro"
          value={props.talksHubIntro}
          onInput={(v) => {
            props.setTalksHubIntro(v);
            mark();
          }}
        />
        <AdminSiteHubIntroCard
          title="Achievements"
          publicPath="/achievements"
          name="achievementsHubIntro"
          value={props.achievementsHubIntro}
          onInput={(v) => {
            props.setAchievementsHubIntro(v);
            mark();
          }}
        />
        <AdminSiteHubIntroCard
          title="About — education & experience"
          publicPath="/about"
          name="experienceHubIntro"
          value={props.experienceHubIntro}
          hint="Shown in the education and experience block on /about when set."
          onInput={(v) => {
            props.setExperienceHubIntro(v);
            mark();
          }}
        />
        <div class="siam-card space-y-3 p-4">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 class="text-base font-semibold text-ink">Collaborations</h3>
              <p class="mt-0.5 text-sm text-ink-muted">
                Optional public{" "}
                <span class="font-mono text-xs">/collaborations</span> when
                enabled and you have published collaboration rows. Manage content
                in{" "}
                <A href="/admin/talks" class="text-link">
                  Talks &amp; service
                </A>
                .
              </p>
            </div>
            <A
              href="/collaborations"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-link no-underline hover:underline"
            >
              View page
            </A>
          </div>
          <FormField label="Show collaborations page" name="collaborationsPageEnabled">
            <label class="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="collaborationsPageEnabled"
                checked={props.collaborationsPageEnabled}
                onChange={(e) => {
                  props.setCollaborationsPageEnabled(e.currentTarget.checked);
                  mark();
                }}
              />
              Enable public collaborations listing
            </label>
          </FormField>
          <FormField label="Page intro" name="collaborationsPageIntro">
            <FormTextarea
              name="collaborationsPageIntro"
              rows={4}
              value={props.collaborationsPageIntro}
              onInput={(e) => {
                props.setCollaborationsPageIntro(e.currentTarget.value);
                mark();
              }}
            />
          </FormField>
        </div>
      </div>
      <FormErrorAlert message={message()} />
      <FormSuccessNotice message={success() ? "Page intros saved." : null} />
      <button type="submit" class="siam-btn-primary" disabled={saving()}>
        {saving() ? "Saving…" : "Save page intros"}
      </button>
    </form>
  );
}
