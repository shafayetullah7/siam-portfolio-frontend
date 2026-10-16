import type { JSX } from "solid-js";

export type LandingSectionProps = {
  id: string;
  title: string;
  kicker?: string;
  children: JSX.Element;
};

export default function LandingSection(props: LandingSectionProps) {
  const headingId = `${props.id}-heading`;

  return (
    <section id={props.id} class="scroll-mt-20" aria-labelledby={headingId}>
      {props.kicker ? <p class="siam-label mb-2">{props.kicker}</p> : null}
      <h2 id={headingId} class="siam-headline-md">
        {props.title}
      </h2>
      <div class="mt-4">{props.children}</div>
    </section>
  );
}
