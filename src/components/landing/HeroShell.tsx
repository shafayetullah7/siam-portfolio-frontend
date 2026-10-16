import type { JSX } from "solid-js";

export type HeroShellProps = {
  children: JSX.Element;
};

export default function HeroShell(props: HeroShellProps) {
  return (
    <div
      class="landing-hero-shell relative w-full overflow-hidden rounded-2xl bg-surface-container-lowest p-5 sm:p-6 lg:p-10"
    >
      <div
        class="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary via-primary to-secondary-container"
        aria-hidden="true"
      />
      <div class="relative">{props.children}</div>
    </div>
  );
}
