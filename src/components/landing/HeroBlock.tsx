import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import type { HomeHero } from "~/content";
import HeroScholarLedger from "./HeroScholarLedger";

export type HeroBlockProps = {
  hero: HomeHero;
};

function HeroPortrait(props: { portrait: NonNullable<HomeHero["portrait"]> }) {
  const alt = props.portrait.alt.trim();
  if (!alt) return null;

  return (
    <div class="aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-muted shadow-card">
      <img
        src={props.portrait.src}
        alt={alt}
        loading="lazy"
        decoding="async"
        class="size-full object-cover"
      />
    </div>
  );
}

export default function HeroBlock(props: HeroBlockProps) {
  const { hero } = props;
  const [copied, setCopied] = createSignal(false);
  const showPortrait = () =>
    hero.portrait != null && hero.portrait.alt.trim() !== "";

  const copyEmail = async () => {
    const email = hero.contactEmail?.trim();
    if (!email || !navigator.clipboard) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-labelledby="home-hero-heading">
      <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div class="flex flex-col lg:col-span-7 xl:col-span-8">
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <Show when={hero.statusBadge?.trim()}>
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-2 py-0.5 font-mono text-xs text-on-secondary-container"
              >
                <span
                  class="h-2 w-2 animate-pulse rounded-full bg-primary"
                  aria-hidden="true"
                />
                {hero.statusBadge}
              </span>
            </Show>
            <span class="siam-eyebrow font-medium uppercase text-secondary">
              {hero.descriptor}
            </span>
          </div>

          <h1 id="home-hero-heading" class="siam-display-hero mb-1 text-brand-deep">
            {hero.name}
          </h1>

          <p class="mt-2 max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
            {hero.positioning}
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <A href={hero.primaryCta.href} class="siam-btn-primary no-underline shadow-sm">
              {hero.primaryCta.label}
            </A>
            <A href={hero.secondaryCta.href} class="siam-btn-secondary no-underline">
              {hero.secondaryCta.label}
            </A>
            <Show when={hero.contactEmail?.trim()}>
              <button
                type="button"
                class="relative inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-2 font-mono text-xs text-ink transition-colors hover:bg-surface-container-high"
                onClick={() => void copyEmail()}
              >
                {hero.contactEmail}
                <span
                  class={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-0.5 text-[10px] text-primary-foreground shadow transition-opacity ${copied() ? "opacity-100" : "pointer-events-none opacity-0"}`}
                  role="status"
                >
                  Copied
                </span>
              </button>
            </Show>
          </div>
        </div>

        <div class="w-full lg:col-span-5 xl:col-span-4">
          <Show when={showPortrait()} fallback={<HeroScholarLedger ledger={hero.ledger} />}>
            <HeroPortrait portrait={hero.portrait!} />
          </Show>
        </div>
      </div>
    </section>
  );
}
