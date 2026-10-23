export type PublicationWizardProgressProps = {
  steps: readonly string[];
  currentStep: number;
  onStepSelect?: (step: number) => void;
};

export default function PublicationWizardProgress(
  props: PublicationWizardProgressProps,
) {
  return (
    <nav aria-label="Publication editor progress" class="mt-8 mb-8">
      <ol class="flex flex-wrap gap-2 sm:gap-4">
        {props.steps.map((label, index) => {
          const step = index + 1;
          const active = props.currentStep === step;
          const done = props.currentStep > step;
          const clickable = Boolean(props.onStepSelect);

          return (
            <li
              class="flex items-center gap-2 text-sm"
              aria-current={active ? "step" : undefined}
            >
              <button
                type="button"
                class="flex items-center gap-2 rounded-lg px-1 py-0.5 text-left transition hover:bg-surface-container-low disabled:cursor-default"
                disabled={!clickable}
                onClick={() => props.onStepSelect?.(step)}
              >
                <span
                  classList={{
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold": true,
                    "bg-primary text-primary-foreground": active,
                    "bg-surface-container-high text-ink-muted": !active && !done,
                    "bg-primary/15 text-primary": done,
                  }}
                >
                  {step}
                </span>
                <span
                  classList={{
                    "font-medium text-ink": active,
                    "text-ink-muted": !active,
                  }}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
