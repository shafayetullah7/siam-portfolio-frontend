import { A } from "@solidjs/router";
import type { JSX } from "solid-js";
import FormField from "~/components/forms/FormField";
import FormTextarea from "~/components/forms/FormTextarea";

export type AdminSiteHubIntroCardProps = {
  title: string;
  publicPath: string;
  name: string;
  value: string;
  rows?: number;
  hint?: string;
  onInput: (value: string) => void;
  children?: JSX.Element;
};

export default function AdminSiteHubIntroCard(props: AdminSiteHubIntroCardProps) {
  return (
    <div class="siam-card space-y-3 p-4">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 class="text-base font-semibold text-ink">{props.title}</h3>
          <p class="mt-0.5 text-sm text-ink-muted">
            {props.hint ?? `Shown at the top of ${props.publicPath} when set.`}
          </p>
        </div>
        <A
          href={props.publicPath}
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-link no-underline hover:underline"
        >
          View page
        </A>
      </div>
      {props.children}
      <FormField label="Intro text" name={props.name}>
        <FormTextarea
          name={props.name}
          rows={props.rows ?? 4}
          value={props.value}
          onInput={(e) => props.onInput(e.currentTarget.value)}
        />
      </FormField>
    </div>
  );
}
