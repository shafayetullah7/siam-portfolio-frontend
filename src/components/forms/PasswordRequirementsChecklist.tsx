import { For, Show } from "solid-js";
import { getAdminPasswordChecks } from "~/lib/auth/adminPasswordPolicy";
import { Check, Circle } from "~/icons";

export type PasswordRequirementsChecklistProps = {
  name: string;
  password: string;
  visible: boolean;
  showErrors?: boolean;
};

export function passwordRequirementsDescribedBy(
  name: string,
  visible: boolean,
): string | undefined {
  return visible ? `${name}-requirements` : undefined;
}

export default function PasswordRequirementsChecklist(
  props: PasswordRequirementsChecklistProps,
) {
  const checks = () => getAdminPasswordChecks(props.password);

  return (
    <Show when={props.visible}>
      <ul
        id={`${props.name}-requirements`}
        class="mt-2 flex flex-col gap-1.5 text-sm"
        role="status"
        aria-live="polite"
      >
        <For each={checks()}>
          {(check) => (
            <li
              classList={{
                "flex items-start gap-2": true,
                "text-success": check.met,
                "text-ink-muted": !check.met && !props.showErrors,
                "text-error": !check.met && props.showErrors,
              }}
            >
              <Show
                when={check.met}
                fallback={<Circle class="mt-0.5 size-4 shrink-0" />}
              >
                <Check class="mt-0.5 size-4 shrink-0" />
              </Show>
              <span>{check.label}</span>
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
}
