import { For } from "solid-js";
import type { HomeProfileLink } from "~/content";
import LandingContentLink from "./LandingContentLink";

export type ProfileLinksProps = {
  items: readonly HomeProfileLink[];
};

export default function ProfileLinks(props: ProfileLinksProps) {
  return (
    <ul class="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0" role="list">
      <For each={props.items}>
        {(profile) => (
          <li>
            <LandingContentLink
              href={profile.href}
              class="text-sm font-medium text-link no-underline hover:underline"
            >
              {profile.label}
            </LandingContentLink>
          </li>
        )}
      </For>
    </ul>
  );
}
