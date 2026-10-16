/** Typography-led hero visual when no portrait (P01 research-led substitute). */
export default function HeroVisualPlaceholder() {
  return (
    <div
      class="relative flex aspect-[4/5] w-full max-w-sm flex-col justify-end overflow-hidden rounded-lg bg-accent-writing p-6"
      aria-hidden="true"
    >
      <div
        class="absolute inset-0 opacity-40"
        style={{
          "background-image":
            "linear-gradient(var(--siam-border) 1px, transparent 1px), linear-gradient(90deg, var(--siam-border) 1px, transparent 1px)",
          "background-size": "24px 24px",
        }}
      />
      <div class="relative space-y-3">
        <div class="h-2 w-16 rounded-full bg-primary/30" />
        <div class="h-2 w-24 rounded-full bg-primary/20" />
        <div class="h-2 w-20 rounded-full bg-primary/15" />
      </div>
      <p class="relative mt-6 text-xs font-medium uppercase tracking-wider text-accent-writing-ink/80">
        Research &amp; learning
      </p>
    </div>
  );
}
