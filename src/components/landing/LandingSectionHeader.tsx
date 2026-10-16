import type { JSX } from "solid-js";

export type LandingSectionHeaderProps = {
  sectionEyebrow: string;
  title: string;
  headingId?: string;
  aside?: JSX.Element;
};

export default function LandingSectionHeader(props: LandingSectionHeaderProps) {
  return (
    <div class="flex flex-col justify-between gap-2 pb-2 sm:flex-row sm:items-end">
      <div>
        <span class="siam-eyebrow mb-1 block text-secondary">{props.sectionEyebrow}</span>
        <h2 id={props.headingId} class="siam-headline-lg font-normal text-brand-deep">
          {props.title}
        </h2>
      </div>
      {props.aside}
    </div>
  );
}
