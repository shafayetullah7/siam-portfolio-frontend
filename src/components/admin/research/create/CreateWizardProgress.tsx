const STEPS = ["Basics", "Story", "Review"] as const;

export type CreateWizardProgressProps = {
  currentStep: number;
};

export default function CreateWizardProgress(props: CreateWizardProgressProps) {
  return (
    <nav aria-label="Create theme progress" class="mb-8">
      <ol class="flex flex-wrap gap-2 sm:gap-4">
        {STEPS.map((label, index) => {
          const step = index + 1;
          const active = props.currentStep === step;
          const done = props.currentStep > step;
          return (
            <li
              class="flex items-center gap-2 text-sm"
              aria-current={active ? "step" : undefined}
            >
              <span
                classList={{
                  "flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold": true,
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
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
