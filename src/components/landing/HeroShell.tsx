import type { JSX } from "solid-js";

export type HeroShellProps = {
  children: JSX.Element;
};

export default function HeroShell(props: HeroShellProps) {
  return (
    <div
      class="overflow-hidden rounded-lg border border-border bg-surface shadow-card border-l-4 border-l-primary"
    >
      <div class="h-1 bg-accent-research" aria-hidden="true" />
      <div class="p-6 sm:p-10">{props.children}</div>
    </div>
  );
}
