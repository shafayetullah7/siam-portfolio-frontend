import type { HomeCurrentlyWorkingOn } from "~/content";
import { formatDisplayDate } from "./formatDisplayDate";

export type CurrentlyWorkingOnProps = {
  data: HomeCurrentlyWorkingOn;
};

export default function CurrentlyWorkingOn(props: CurrentlyWorkingOnProps) {
  const updatedLabel = () => formatDisplayDate(props.data.updatedAt);

  return (
    <div>
      <p class="siam-prose text-ink-muted">{props.data.text}</p>
      <p class="mt-3 font-mono text-xs font-medium uppercase tracking-wider text-ink-subtle">
        Updated {updatedLabel()}
      </p>
    </div>
  );
}
