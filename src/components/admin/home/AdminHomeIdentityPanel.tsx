import { For, type JSX } from "solid-js";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import type { ScholarlyProfileLink } from "~/lib/api/types/home.types";
import type { ExpertiseLinesForm } from "~/lib/profile/expertise-form";
import AdminHomeMediaField from "./AdminHomeMediaField";

export type IdentityFormState = {
  displayName: string;
  professionalTitle: string;
  headline: string;
  contactEmail: string;
  affiliation: string;
  affiliationRole: string;
  affiliationOrganization: string;
  affiliationLocation: string;
  shortBio: string;
  longBio: string;
  researchStatement: string;
  expertiseLines: ExpertiseLinesForm;
  collaborationInterests: string;
  scholarlyProfiles: ScholarlyProfileLink[];
  portraitMediaId: string | null;
};

export type AdminHomeIdentityPanelProps = {
  form: IdentityFormState;
  onChange: (patch: Partial<IdentityFormState>) => void;
  onDirty: () => void;
  onSubmit: (e: Event) => void;
  saving: boolean;
  fieldErrors: Record<string, string>;
  footer?: JSX.Element;
};

function emptyScholarlyLink(): ScholarlyProfileLink {
  return { label: "", href: "" };
}

export default function AdminHomeIdentityPanel(props: AdminHomeIdentityPanelProps) {
  function update<K extends keyof IdentityFormState>(
    key: K,
    value: IdentityFormState[K],
  ) {
    props.onChange({ [key]: value });
    props.onDirty();
  }

  function updateScholarly(index: number, patch: Partial<ScholarlyProfileLink>) {
    const next = props.form.scholarlyProfiles.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
    update("scholarlyProfiles", next);
  }

  function removeScholarly(index: number) {
    update(
      "scholarlyProfiles",
      props.form.scholarlyProfiles.filter((_, i) => i !== index),
    );
  }

  function addScholarly() {
    update("scholarlyProfiles", [
      ...props.form.scholarlyProfiles,
      emptyScholarlyLink(),
    ]);
  }

  return (
    <form class="mt-6 max-w-3xl space-y-6" onSubmit={props.onSubmit}>
      <AdminHomeMediaField
        label="Portrait"
        helperText="Default hero image on the live home when no Composition hero image is set. Alt is enforced on Profile publish."
        mediaId={props.form.portraitMediaId}
        onDirty={props.onDirty}
        onChange={(id) => update("portraitMediaId", id)}
      />

      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-ink">Name & title</h2>
        <FormField
          label="Display name"
          name="displayName"
          error={props.fieldErrors.displayName}
        >
          <FormTextInput
            name="displayName"
            maxlength={200}
            value={props.form.displayName}
            onInput={(e) => update("displayName", e.currentTarget.value)}
          />
        </FormField>
        <FormField
          label="Professional title"
          name="professionalTitle"
          error={props.fieldErrors.professionalTitle}
        >
          <FormTextInput
            name="professionalTitle"
            maxlength={300}
            value={props.form.professionalTitle}
            onInput={(e) => update("professionalTitle", e.currentTarget.value)}
          />
        </FormField>
        <FormField
          label="Headline"
          name="headline"
          error={props.fieldErrors.headline}
        >
          <FormTextInput
            name="headline"
            maxlength={300}
            value={props.form.headline}
            onInput={(e) => update("headline", e.currentTarget.value)}
          />
        </FormField>
        <FormField
          label="Contact email"
          name="contactEmail"
          error={props.fieldErrors.contactEmail}
        >
          <FormTextInput
            name="contactEmail"
            type="email"
            maxlength={320}
            value={props.form.contactEmail}
            onInput={(e) => update("contactEmail", e.currentTarget.value)}
          />
        </FormField>
      </section>

      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-ink">Affiliation</h2>
        <FormField
          label="Affiliation (legacy single line)"
          name="affiliation"
          error={props.fieldErrors.affiliation}
        >
          <FormTextInput
            name="affiliation"
            maxlength={300}
            value={props.form.affiliation}
            onInput={(e) => update("affiliation", e.currentTarget.value)}
          />
        </FormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Role"
            name="affiliationRole"
            error={props.fieldErrors.affiliationRole}
          >
            <FormTextInput
              name="affiliationRole"
              maxlength={300}
              value={props.form.affiliationRole}
              onInput={(e) => update("affiliationRole", e.currentTarget.value)}
            />
          </FormField>
          <FormField
            label="Organization"
            name="affiliationOrganization"
            error={props.fieldErrors.affiliationOrganization}
          >
            <FormTextInput
              name="affiliationOrganization"
              maxlength={300}
              value={props.form.affiliationOrganization}
              onInput={(e) =>
                update("affiliationOrganization", e.currentTarget.value)
              }
            />
          </FormField>
        </div>
        <FormField
          label="Location"
          name="affiliationLocation"
          error={props.fieldErrors.affiliationLocation}
        >
          <FormTextInput
            name="affiliationLocation"
            maxlength={300}
            value={props.form.affiliationLocation}
            onInput={(e) =>
              update("affiliationLocation", e.currentTarget.value)
            }
          />
        </FormField>
      </section>

      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-ink">Bio</h2>
        <FormField
          label="Short bio"
          name="shortBio"
          error={props.fieldErrors.shortBio}
        >
          <FormTextarea
            name="shortBio"
            rows={3}
            value={props.form.shortBio}
            onInput={(e) => update("shortBio", e.currentTarget.value)}
          />
        </FormField>
        <FormField
          label="Long bio"
          name="longBio"
          error={props.fieldErrors.longBio}
        >
          <FormTextarea
            name="longBio"
            rows={6}
            value={props.form.longBio}
            onInput={(e) => update("longBio", e.currentTarget.value)}
          />
        </FormField>
        <FormField
          label="Research statement"
          name="researchStatement"
          error={props.fieldErrors.researchStatement}
          hint="Markdown supported — rendered on the public About page."
        >
          <FormTextarea
            name="researchStatement"
            rows={4}
            value={props.form.researchStatement}
            onInput={(e) => update("researchStatement", e.currentTarget.value)}
          />
        </FormField>
      </section>

      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-ink">Research expertise</h2>
        <p class="text-sm text-ink-muted">
          One topic per line. Groups appear on <code class="text-xs">/about</code>{" "}
          without skill levels.
        </p>
        <FormField label="Domains" name="expertiseDomains">
          <FormTextarea
            name="expertiseDomains"
            rows={3}
            placeholder="e.g. trustworthy machine learning"
            value={props.form.expertiseLines.domains}
            onInput={(e) =>
              update("expertiseLines", {
                ...props.form.expertiseLines,
                domains: e.currentTarget.value,
              })
            }
          />
        </FormField>
        <FormField label="Methodologies" name="expertiseMethodologies">
          <FormTextarea
            name="expertiseMethodologies"
            rows={3}
            value={props.form.expertiseLines.methodologies}
            onInput={(e) =>
              update("expertiseLines", {
                ...props.form.expertiseLines,
                methodologies: e.currentTarget.value,
              })
            }
          />
        </FormField>
        <FormField label="Programming & tooling" name="expertiseTooling">
          <FormTextarea
            name="expertiseTooling"
            rows={3}
            value={props.form.expertiseLines.tooling}
            onInput={(e) =>
              update("expertiseLines", {
                ...props.form.expertiseLines,
                tooling: e.currentTarget.value,
              })
            }
          />
        </FormField>
        <FormField label="Scientific practices" name="expertisePractices">
          <FormTextarea
            name="expertisePractices"
            rows={3}
            value={props.form.expertiseLines.practices}
            onInput={(e) =>
              update("expertiseLines", {
                ...props.form.expertiseLines,
                practices: e.currentTarget.value,
              })
            }
          />
        </FormField>
      </section>

      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-ink">Collaboration interests</h2>
        <FormField
          label="About-page collaboration text"
          name="collaborationInterests"
          hint="Shown on /about (separate from the Home collaboration CTA)."
        >
          <FormTextarea
            name="collaborationInterests"
            rows={3}
            value={props.form.collaborationInterests}
            onInput={(e) =>
              update("collaborationInterests", e.currentTarget.value)
            }
          />
        </FormField>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-lg font-semibold text-ink">Scholarly profiles</h2>
          <button
            type="button"
            class="siam-btn-secondary text-sm"
            onClick={addScholarly}
          >
            Add link
          </button>
        </div>
        <For each={props.form.scholarlyProfiles}>
          {(row, index) => (
            <div class="siam-card space-y-2 p-4">
              <div class="grid gap-2 sm:grid-cols-2">
                <FormTextInput
                  name={`scholarly-label-${index()}`}
                  placeholder="Label"
                  value={row.label}
                  onInput={(e) =>
                    updateScholarly(index(), { label: e.currentTarget.value })
                  }
                />
                <FormTextInput
                  name={`scholarly-href-${index()}`}
                  placeholder="https://"
                  value={row.href}
                  onInput={(e) =>
                    updateScholarly(index(), { href: e.currentTarget.value })
                  }
                />
              </div>
              <FormTextInput
                name={`scholarly-subtitle-${index()}`}
                placeholder="Subtitle (optional)"
                value={row.subtitle ?? ""}
                onInput={(e) =>
                  updateScholarly(index(), {
                    subtitle: e.currentTarget.value || undefined,
                  })
                }
              />
              <button
                type="button"
                class="text-sm text-error"
                onClick={() => removeScholarly(index())}
              >
                Remove
              </button>
            </div>
          )}
        </For>
      </section>

      {props.footer}

      <button type="submit" class="siam-btn-primary" disabled={props.saving}>
        {props.saving ? "Saving…" : "Save identity"}
      </button>
    </form>
  );
}
