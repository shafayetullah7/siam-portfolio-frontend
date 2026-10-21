export type ThemeStatusChoiceProps = {
  value: "ongoing" | "completed";
  onChange: (value: "ongoing" | "completed") => void;
};

export default function ThemeStatusChoice(props: ThemeStatusChoiceProps) {
  const options: {
    value: "ongoing" | "completed";
    title: string;
    description: string;
  }[] = [
    {
      value: "ongoing",
      title: "Ongoing",
      description: "Active program — emphasize objectives and progress, not final results.",
    },
    {
      value: "completed",
      title: "Completed",
      description: "Past or wrapped work — findings and limitations are expected.",
    },
  ];

  return (
    <div class="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Theme status">
      {options.map((opt) => (
        <button
          type="button"
          role="radio"
          aria-checked={props.value === opt.value}
          classList={{
            "siam-card cursor-pointer p-4 text-left transition-shadow": true,
            "ring-2 ring-primary": props.value === opt.value,
            "hover:shadow-md": props.value !== opt.value,
          }}
          onClick={() => props.onChange(opt.value)}
        >
          <p class="font-semibold text-ink">{opt.title}</p>
          <p class="mt-1 text-sm text-ink-muted">{opt.description}</p>
        </button>
      ))}
    </div>
  );
}
