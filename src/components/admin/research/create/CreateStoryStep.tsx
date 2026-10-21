import { Show } from "solid-js";
import FormField from "~/components/forms/FormField";
import FormTextarea from "~/components/forms/FormTextarea";
import type { ResearchThemeCreateDraft } from "./createWizard.types";

export type CreateStoryStepProps = {
  draft: ResearchThemeCreateDraft;
  fieldErrors: Record<string, string>;
  onDraftChange: (patch: Partial<ResearchThemeCreateDraft>) => void;
  onDirty: () => void;
};

export default function CreateStoryStep(props: CreateStoryStepProps) {
  const d = () => props.draft;
  const ongoing = () => d().themeStatus === "ongoing";

  return (
    <div class="siam-card space-y-5 p-6">
      <div>
        <p class="siam-eyebrow text-secondary">Step 2</p>
        <h2 class="text-lg font-semibold text-ink">Story</h2>
        <p class="mt-1 text-sm text-ink-muted">
          Plain-language narrative for the public detail page. Avoid implying
          completed results for ongoing themes.
        </p>
      </div>

      <FormField label="Problem" name="problem" error={props.fieldErrors.problem}>
        <FormTextarea
          name="problem"
          rows={4}
          value={d().problem}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ problem: e.currentTarget.value });
          }}
          error={props.fieldErrors.problem}
        />
      </FormField>

      <FormField label="Significance" name="significance">
        <FormTextarea
          name="significance"
          rows={3}
          value={d().significance}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ significance: e.currentTarget.value });
          }}
        />
      </FormField>

      <Show when={ongoing()}>
        <div class="rounded-lg border border-border bg-surface-container-lowest p-4">
          <p class="text-sm font-medium text-ink">Objectives (recommended)</p>
          <p class="mt-1 text-xs text-ink-muted">
            For ongoing themes, state what you are trying to learn — not final
            findings.
          </p>
          <div class="mt-3">
          <FormField label="Objectives" name="objectives">
            <FormTextarea
              name="objectives"
              rows={3}
              value={d().objectives}
              onInput={(e) => {
                props.onDirty();
                props.onDraftChange({ objectives: e.currentTarget.value });
              }}
            />
          </FormField>
          </div>
        </div>
      </Show>

      <Show when={!ongoing()}>
        <FormField label="Objectives" name="objectives">
          <FormTextarea
            name="objectives"
            rows={3}
            value={d().objectives}
            onInput={(e) => {
              props.onDirty();
              props.onDraftChange({ objectives: e.currentTarget.value });
            }}
          />
        </FormField>
      </Show>

      <FormField label="Approach" name="approach">
        <FormTextarea
          name="approach"
          rows={3}
          value={d().approach}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ approach: e.currentTarget.value });
          }}
        />
      </FormField>

      <Show
        when={d().themeStatus === "completed"}
        fallback={
          <p class="text-sm text-ink-muted">
            Findings, limitations, and future work can be added after save when
            you mark the theme completed or from the full editor.
          </p>
        }
      >
        <FormField label="Findings" name="findings">
          <FormTextarea
            name="findings"
            rows={3}
            value={d().findings}
            onInput={(e) => {
              props.onDirty();
              props.onDraftChange({ findings: e.currentTarget.value });
            }}
          />
        </FormField>
        <FormField label="Limitations" name="limitations">
          <FormTextarea
            name="limitations"
            rows={3}
            value={d().limitations}
            onInput={(e) => {
              props.onDirty();
              props.onDraftChange({ limitations: e.currentTarget.value });
            }}
          />
        </FormField>
        <FormField label="Future work" name="futureWork">
          <FormTextarea
            name="futureWork"
            rows={3}
            value={d().futureWork}
            onInput={(e) => {
              props.onDirty();
              props.onDraftChange({ futureWork: e.currentTarget.value });
            }}
          />
        </FormField>
      </Show>
    </div>
  );
}
