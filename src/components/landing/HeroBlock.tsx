import { A } from "@solidjs/router";
import { Show } from "solid-js";
import type { HomeHero } from "~/content";
import HeroVisualPlaceholder from "./HeroVisualPlaceholder";

export type HeroBlockProps = {
  hero: HomeHero;
};

function HeroPortrait(props: { portrait: NonNullable<HomeHero["portrait"]> }) {
  const alt = props.portrait.alt.trim();
  if (!alt) return null;

  return (
    <div class="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg bg-surface-muted shadow-card">
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

function HeroAside(props: { hero: HomeHero }) {
  const showPortrait = () =>
    props.hero.portrait != null && props.hero.portrait.alt.trim() !== "";

  return (
    <Show when={showPortrait()} fallback={<HeroVisualPlaceholder />}>
      <HeroPortrait portrait={props.hero.portrait!} />
    </Show>
  );
}

export default function HeroBlock(props: HeroBlockProps) {
  const { hero } = props;

  return (
    <section aria-labelledby="home-hero-heading">
      <div class="lg:grid lg:grid-cols-[1fr_minmax(12rem,28%)] lg:items-center lg:gap-10 xl:gap-12">
        <div>
          <p class="siam-label mb-4 text-primary">{hero.descriptor}</p>
          <h1
            id="home-hero-heading"
            class="max-w-3xl text-[clamp(2.75rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-tight text-ink"
          >
            {hero.name}
          </h1>
          <p class="siam-prose mt-6 max-w-2xl text-lg text-ink-muted lg:max-w-prose">
            {hero.positioning}
          </p>
          <div class="mt-10 flex flex-wrap gap-3">
            <A href={hero.primaryCta.href} class="siam-btn-primary no-underline">
              {hero.primaryCta.label}
            </A>
            <A href={hero.secondaryCta.href} class="siam-btn-secondary no-underline">
              {hero.secondaryCta.label}
            </A>
          </div>
        </div>
        <div class="mt-10 lg:mt-0 lg:flex lg:justify-end">
          <HeroAside hero={hero} />
        </div>
      </div>
    </section>
  );
}
