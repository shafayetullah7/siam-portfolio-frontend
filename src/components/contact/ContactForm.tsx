import { createSignal, For, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { contactPublicApi } from "~/lib/api/endpoints/public/contact.api";
import {
  getApiErrorUserMessage,
  isApiError,
} from "~/lib/api/errors";
import type { PublicContactConfig } from "~/lib/api/types/contact.types";
import { mapZodErrors } from "~/lib/forms/mapZodErrors";
import {
  contactInquirySchema,
  type ContactInquiryInput,
} from "~/lib/forms/schemas/contact-inquiry.schema";
import ContactSuccessState from "./ContactSuccessState";

export type ContactFormProps = {
  config: PublicContactConfig;
};

const emptyForm = (): ContactInquiryInput => ({
  name: "",
  email: "",
  message: "",
  category: "",
  affiliation: "",
  consent: false,
  website: "",
});

export default function ContactForm(props: ContactFormProps) {
  const [form, setForm] = createSignal<ContactInquiryInput>(emptyForm());
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>(
    {},
  );
  const [formMessage, setFormMessage] = createSignal<string | null>(null);
  const [submitting, setSubmitting] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);

  const consentRequired = () => Boolean(props.config.consentText?.trim());
  const categories = () => props.config.categories ?? [];

  const update =
    <K extends keyof ContactInquiryInput>(key: K) =>
    (value: ContactInquiryInput[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setFormMessage(null);
    setFieldErrors({});

    const values = form();
    if (consentRequired() && !values.consent) {
      setFieldErrors({ consent: "You must agree before sending." });
      return;
    }
    if (categories().length > 0 && !values.category?.trim()) {
      setFieldErrors({ category: "Please choose a category." });
      return;
    }

    const parsed = contactInquirySchema.safeParse({
      ...values,
      category: values.category?.trim() || undefined,
      affiliation: values.affiliation?.trim() || undefined,
    });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      setFormMessage("Check the fields below.");
      return;
    }

    setSubmitting(true);
    try {
      await contactPublicApi.submit(parsed.data);
      setSubmitted(true);
    } catch (error) {
      if (isApiError(error) && error.status === 503) {
        setFormMessage(
          "The contact form is not available. Try email or other channels on this page.",
        );
      } else {
        const copy = getApiErrorUserMessage(error);
        setFormMessage(copy.description);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const successMessage = () =>
    props.config.successMessage?.trim() ||
    "Thank you — your message was received.";

  return (
    <Show
      when={!submitted()}
      fallback={<ContactSuccessState message={successMessage()} />}
    >
      <form class="mt-8 grid max-w-xl gap-4" onSubmit={handleSubmit} noValidate>
        <FormErrorAlert message={formMessage()} />

        <label class="flex flex-col gap-1 text-sm text-ink-muted">
          Name
          <input
            class="siam-input mt-0.5 text-ink"
            name="name"
            autocomplete="name"
            value={form().name}
            onInput={(e) => update("name")(e.currentTarget.value)}
            aria-invalid={Boolean(fieldErrors().name)}
            aria-describedby={fieldErrors().name ? "contact-name-error" : undefined}
          />
          <Show when={fieldErrors().name}>
            <span id="contact-name-error" class="text-sm text-error" role="alert">
              {fieldErrors().name}
            </span>
          </Show>
        </label>

        <label class="flex flex-col gap-1 text-sm text-ink-muted">
          Email
          <input
            class="siam-input mt-0.5 text-ink"
            name="email"
            type="email"
            autocomplete="email"
            value={form().email}
            onInput={(e) => update("email")(e.currentTarget.value)}
            aria-invalid={Boolean(fieldErrors().email)}
          />
          <Show when={fieldErrors().email}>
            <span class="text-sm text-error" role="alert">{fieldErrors().email}</span>
          </Show>
        </label>

        <Show when={categories().length > 0}>
          <label class="flex flex-col gap-1 text-sm text-ink-muted">
            Category
            <select
              class="siam-input mt-0.5 text-ink"
              name="category"
              value={form().category ?? ""}
              onChange={(e) => update("category")(e.currentTarget.value)}
              aria-invalid={Boolean(fieldErrors().category)}
            >
              <option value="">Select a topic</option>
              <For each={categories()}>
                {(cat) => <option value={cat}>{cat}</option>}
              </For>
            </select>
            <Show when={fieldErrors().category}>
              <span class="text-sm text-error" role="alert">
                {fieldErrors().category}
              </span>
            </Show>
          </label>
        </Show>

        <label class="flex flex-col gap-1 text-sm text-ink-muted">
          Affiliation (optional)
          <input
            class="siam-input mt-0.5 text-ink"
            name="affiliation"
            value={form().affiliation ?? ""}
            onInput={(e) => update("affiliation")(e.currentTarget.value)}
          />
        </label>

        <label class="flex flex-col gap-1 text-sm text-ink-muted">
          Message
          <textarea
            class="siam-input mt-0.5 min-h-[140px] text-ink"
            name="message"
            value={form().message}
            onInput={(e) => update("message")(e.currentTarget.value)}
            aria-invalid={Boolean(fieldErrors().message)}
          />
          <Show when={fieldErrors().message}>
            <span class="text-sm text-error" role="alert">
              {fieldErrors().message}
            </span>
          </Show>
        </label>

        <Show when={consentRequired()}>
          <label class="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="consent"
              checked={form().consent}
              onChange={(e) => update("consent")(e.currentTarget.checked)}
              class="mt-1"
            />
            <span class="text-ink-muted">{props.config.consentText}</span>
          </label>
          <Show when={fieldErrors().consent}>
            <span class="text-sm text-error" role="alert">
              {fieldErrors().consent}
            </span>
          </Show>
        </Show>

        <div class="sr-only" aria-hidden="true">
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autocomplete="off"
              value={form().website ?? ""}
              onInput={(e) => update("website")(e.currentTarget.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          class="siam-btn-primary w-fit"
          disabled={submitting()}
        >
          {submitting() ? "Sending…" : "Send message"}
        </button>
      </form>
    </Show>
  );
}
