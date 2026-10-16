import { Show } from "solid-js";
import { Eye, EyeOff } from "~/icons";

export type PasswordVisibilityToggleProps = {
  visible: boolean;
  onToggle: () => void;
};

export default function PasswordVisibilityToggle(
  props: PasswordVisibilityToggleProps,
) {
  const label = () => (props.visible ? "Hide password" : "Show password");

  return (
    <button
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-muted hover:text-ink focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-primary/40"
      aria-label={label()}
      aria-pressed={props.visible}
      onClick={() => props.onToggle()}
    >
      <Show when={props.visible} fallback={<Eye class="size-5 shrink-0" />}>
        <EyeOff class="size-5 shrink-0" />
      </Show>
    </button>
  );
}
