import { createSignal, type JSX } from "solid-js";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import type {
  HomeFeaturedSummaryResponse,
  HomeSectionConfig,
} from "~/lib/api/types/home.types";
import HomeFeaturedSummaryPanel from "./HomeFeaturedSummaryPanel";
import HomeSectionsEditor from "./HomeSectionsEditor";
import AdminHomeMediaField from "./AdminHomeMediaField";

export type CompositionFormState = {
  heroTitle: string;
  heroSubtitle: string;
  heroDescriptor: string;
  heroPositioning: string;
  statusBadge: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  seoTitle: string;
  seoDescription: string;
  sections: HomeSectionConfig[];
  heroMediaId: string | null;
};

export type AdminHomeCompositionPanelProps = {
  form: CompositionFormState;
  onChange: (patch: Partial<CompositionFormState>) => void;
  onDirty: () => void;
  onSubmit: (e: Event) => void;
  saving: boolean;
  fieldErrors: Record<string, string>;
  featuredSummary?: HomeFeaturedSummaryResponse;
  featuredSummaryLoading?: boolean;
  footer?: JSX.Element;
};

export default function AdminHomeCompositionPanel(
  props: AdminHomeCompositionPanelProps,
) {
  const [showSeo, setShowSeo] = createSignal(false);

  function update<K extends keyof CompositionFormState>(
    key: K,
    value: CompositionFormState[K],
  ) {
    props.onChange({ [key]: value });
    props.onDirty();
  }

  return (
    <form class="mt-6 max-w-3xl space-y-6" onSubmit={props.onSubmit}>
      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-ink">Hero</h2>
        <AdminHomeMediaField
          label="Hero image (optional)"
          helperText="Overrides the Identity portrait on the published home when set."
          mediaId={props.form.heroMediaId}
          onDirty={props.onDirty}
          onChange={(id) => update("heroMediaId", id)}
        />
        <FormField
          label="Hero title"
          name="heroTitle"
          error={props.fieldErrors.heroTitle}
        >
          <FormTextInput
            name="heroTitle"
            maxlength={500}
            value={props.form.heroTitle}
            onInput={(e) => update("heroTitle", e.currentTarget.value)}
          />
        </FormField>
        <FormField
          label="Hero subtitle"
          name="heroSubtitle"
          error={props.fieldErrors.heroSubtitle}
        >
          <FormTextInput
            name="heroSubtitle"
            value={props.form.heroSubtitle}
            onInput={(e) => update("heroSubtitle", e.currentTarget.value)}
          />
        </FormField>
        <FormField
          label="Descriptor"
          name="heroDescriptor"
          error={props.fieldErrors.heroDescriptor}
        >
          <FormTextInput
            name="heroDescriptor"
            maxlength={500}
            value={props.form.heroDescriptor}
            onInput={(e) => update("heroDescriptor", e.currentTarget.value)}
          />
        </FormField>
        <FormField
          label="Positioning line"
          name="heroPositioning"
          error={props.fieldErrors.heroPositioning}
        >
          <FormTextarea
            name="heroPositioning"
            rows={2}
            value={props.form.heroPositioning}
            onInput={(e) => update("heroPositioning", e.currentTarget.value)}
          />
        </FormField>
        <FormField
          label="Status badge"
          name="statusBadge"
          error={props.fieldErrors.statusBadge}
        >
          <FormTextInput
            name="statusBadge"
            maxlength={80}
            value={props.form.statusBadge}
            onInput={(e) => update("statusBadge", e.currentTarget.value)}
          />
        </FormField>
      </section>

      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-ink">Call to action</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Primary label"
            name="primaryCtaLabel"
            error={props.fieldErrors.primaryCtaLabel}
          >
            <FormTextInput
              name="primaryCtaLabel"
              maxlength={120}
              value={props.form.primaryCtaLabel}
              onInput={(e) => update("primaryCtaLabel", e.currentTarget.value)}
            />
          </FormField>
          <FormField
            label="Primary href"
            name="primaryCtaHref"
            error={props.fieldErrors.primaryCtaHref}
          >
            <FormTextInput
              name="primaryCtaHref"
              maxlength={500}
              value={props.form.primaryCtaHref}
              onInput={(e) => update("primaryCtaHref", e.currentTarget.value)}
            />
          </FormField>
          <FormField
            label="Secondary label"
            name="secondaryCtaLabel"
            error={props.fieldErrors.secondaryCtaLabel}
          >
            <FormTextInput
              name="secondaryCtaLabel"
              maxlength={120}
              value={props.form.secondaryCtaLabel}
              onInput={(e) => update("secondaryCtaLabel", e.currentTarget.value)}
            />
          </FormField>
          <FormField
            label="Secondary href"
            name="secondaryCtaHref"
            error={props.fieldErrors.secondaryCtaHref}
          >
            <FormTextInput
              name="secondaryCtaHref"
              maxlength={500}
              value={props.form.secondaryCtaHref}
              onInput={(e) => update("secondaryCtaHref", e.currentTarget.value)}
            />
          </FormField>
        </div>
      </section>

      <HomeFeaturedSummaryPanel
        summary={props.featuredSummary}
        loading={props.featuredSummaryLoading}
      />

      <section>
        <h2 class="text-lg font-semibold text-ink">Sections</h2>
        <div class="mt-4">
          <HomeSectionsEditor
            sections={props.form.sections}
            onChange={(sections) => update("sections", sections)}
            onDirty={props.onDirty}
            fieldError={props.fieldErrors.sections}
          />
        </div>
      </section>

      <section>
        <button
          type="button"
          class="text-sm font-medium text-primary"
          onClick={() => setShowSeo((v) => !v)}
        >
          {showSeo() ? "Hide SEO fields" : "Show SEO fields"}
        </button>
        {showSeo() ? (
          <div class="mt-4 grid gap-4">
            <FormField
              label="SEO title"
              name="seoTitle"
              error={props.fieldErrors.seoTitle}
            >
              <FormTextInput
                name="seoTitle"
                maxlength={120}
                value={props.form.seoTitle}
                onInput={(e) => update("seoTitle", e.currentTarget.value)}
              />
            </FormField>
            <FormField
              label="SEO description"
              name="seoDescription"
              error={props.fieldErrors.seoDescription}
            >
              <FormTextarea
                name="seoDescription"
                rows={3}
                maxlength={320}
                value={props.form.seoDescription}
                onInput={(e) => update("seoDescription", e.currentTarget.value)}
              />
            </FormField>
          </div>
        ) : null}
      </section>

      {props.footer}

      <button type="submit" class="siam-btn-primary" disabled={props.saving}>
        {props.saving ? "Saving…" : "Save composition"}
      </button>
    </form>
  );
}
