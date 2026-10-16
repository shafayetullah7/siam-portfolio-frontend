import { Show, type JSX } from "solid-js";

export type FormFieldProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: JSX.Element;
};

export default function FormField(props: FormFieldProps) {
  const errorId = () => `${props.name}-error`;
  const hintId = () => `${props.name}-hint`;

  return (
    <label class="block text-sm font-medium">
      {props.label}
      <div class="mt-1">{props.children}</div>
      <Show when={props.hint}>
        <p id={hintId()} class="mt-1 text-sm text-ink-muted">{props.hint}</p>
      </Show>
      <Show when={props.error}>
        <p id={errorId()} class="mt-1 text-sm text-error">{props.error}</p>
      </Show>
    </label>
  );
}

export function fieldDescribedBy(
  name: string,
  error?: string,
  hint?: string,
): string | undefined {
  const ids: string[] = [];
  if (hint) ids.push(`${name}-hint`);
  if (error) ids.push(`${name}-error`);
  return ids.length > 0 ? ids.join(" ") : undefined;
}
