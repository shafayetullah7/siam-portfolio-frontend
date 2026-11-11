import { createSignal } from "solid-js";
import ContactCategoriesEditor from "./ContactCategoriesEditor";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import { emptyToNull } from "~/lib/admin/site/site-settings-form";
import { saveSiteSettingsPanel } from "~/lib/admin/site/saveSiteSettingsPanel";

export type AdminSiteContactPanelProps = {
  contactFormEnabled: boolean;
  setContactFormEnabled: (v: boolean) => void;
  contactPageIntro: string;
  setContactPageIntro: (v: string) => void;
  contactCollaborationGuidance: string;
  setContactCollaborationGuidance: (v: string) => void;
  contactResponseTimeNote: string;
  setContactResponseTimeNote: (v: string) => void;
  contactCategories: string[];
  setContactCategories: (v: string[]) => void;
  contactConsentText: string;
  setContactConsentText: (v: string) => void;
  contactSuccessMessage: string;
  setContactSuccessMessage: (v: string) => void;
  contactPublicEmail: string;
  setContactPublicEmail: (v: string) => void;
  contactShowEmailOnPage: boolean;
  setContactShowEmailOnPage: (v: boolean) => void;
  onDirty: () => void;
  onSaved: () => void;
};

export default function AdminSiteContactPanel(props: AdminSiteContactPanelProps) {
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});
  const [success, setSuccess] = createSignal(false);

  function mark() {
    props.onDirty();
    setSuccess(false);
  }

  async function handleSave(e: Event) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setFieldErrors({});
    setSuccess(false);
    const result = await saveSiteSettingsPanel("contact", {
      contactFormEnabled: props.contactFormEnabled,
      contactPageIntro: emptyToNull(props.contactPageIntro),
      contactCollaborationGuidance: emptyToNull(props.contactCollaborationGuidance),
      contactResponseTimeNote: emptyToNull(props.contactResponseTimeNote),
      contactCategories: props.contactCategories,
      contactConsentText: emptyToNull(props.contactConsentText),
      contactSuccessMessage: emptyToNull(props.contactSuccessMessage),
      contactPublicEmail: emptyToNull(props.contactPublicEmail),
      contactShowEmailOnPage: props.contactShowEmailOnPage,
    });
    setSaving(false);
    if (result.ok) {
      setSuccess(true);
      props.onSaved();
      return;
    }
    setMessage(result.formMessage);
    setFieldErrors(result.fieldErrors ?? {});
  }

  return (
    <form class="space-y-4" onSubmit={handleSave}>
      <p class="text-sm text-ink-muted">
        Copy and form options for the public{" "}
        <span class="font-mono text-xs">/contact</span> page. Inbox messages are
        managed under Messages in the sidebar.
      </p>
      <FormField label="Enable contact form" name="contactFormEnabled">
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.contactFormEnabled}
            onChange={(e) => {
              props.setContactFormEnabled(e.currentTarget.checked);
              mark();
            }}
          />
          Show inquiry form (when off, channels-only page)
        </label>
      </FormField>
      <FormField
        label="Contact page intro"
        name="contactPageIntro"
        error={fieldErrors().contactPageIntro}
      >
        <FormTextarea
          name="contactPageIntro"
          rows={4}
          value={props.contactPageIntro}
          onInput={(e) => {
            props.setContactPageIntro(e.currentTarget.value);
            mark();
          }}
        />
      </FormField>
      <FormField label="Collaboration guidance" name="contactCollaborationGuidance">
        <FormTextarea
          name="contactCollaborationGuidance"
          rows={3}
          value={props.contactCollaborationGuidance}
          onInput={(e) => {
            props.setContactCollaborationGuidance(e.currentTarget.value);
            mark();
          }}
        />
      </FormField>
      <FormField label="Response time note" name="contactResponseTimeNote">
        <FormTextarea
          name="contactResponseTimeNote"
          rows={2}
          value={props.contactResponseTimeNote}
          onInput={(e) => {
            props.setContactResponseTimeNote(e.currentTarget.value);
            mark();
          }}
        />
      </FormField>
      <FormField
        label="Inquiry categories"
        name="contactCategories"
        error={fieldErrors().contactCategories}
      >
        <ContactCategoriesEditor
          categories={props.contactCategories}
          onChange={(cats) => {
            props.setContactCategories(cats);
            mark();
          }}
          onDirty={mark}
        />
      </FormField>
      <FormField label="Consent text" name="contactConsentText">
        <FormTextarea
          name="contactConsentText"
          rows={3}
          value={props.contactConsentText}
          onInput={(e) => {
            props.setContactConsentText(e.currentTarget.value);
            mark();
          }}
          hint="When set, submitters must accept this before sending."
        />
      </FormField>
      <FormField label="Success message" name="contactSuccessMessage">
        <FormTextarea
          name="contactSuccessMessage"
          rows={2}
          value={props.contactSuccessMessage}
          onInput={(e) => {
            props.setContactSuccessMessage(e.currentTarget.value);
            mark();
          }}
        />
      </FormField>
      <FormField
        label="Public contact email"
        name="contactPublicEmail"
        error={fieldErrors().contactPublicEmail}
      >
        <FormTextInput
          name="contactPublicEmail"
          type="email"
          value={props.contactPublicEmail}
          onInput={(e) => {
            props.setContactPublicEmail(e.currentTarget.value);
            mark();
          }}
        />
      </FormField>
      <FormField label="Show email on page" name="contactShowEmailOnPage">
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.contactShowEmailOnPage}
            onChange={(e) => {
              props.setContactShowEmailOnPage(e.currentTarget.checked);
              mark();
            }}
          />
          Display mailto link on /contact (spam tradeoff)
        </label>
      </FormField>
      <FormErrorAlert message={message()} />
      <FormSuccessNotice message={success() ? "Contact settings saved." : null} />
      <button type="submit" class="siam-btn-primary" disabled={saving()}>
        {saving() ? "Saving…" : "Save contact settings"}
      </button>
    </form>
  );
}
