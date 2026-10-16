import { splitProps, type JSX } from "solid-js";
import { fieldDescribedBy } from "./FormField";

export type FormTextInputProps = {
  name: string;
  error?: string;
  hint?: string;
  /** Additional aria-describedby ids (e.g. password requirements list). */
  describedByExtra?: string;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

export default function FormTextInput(props: FormTextInputProps) {
  const [local, rest] = splitProps(props, [
    "name",
    "error",
    "hint",
    "describedByExtra",
    "class",
  ]);
  return (
    <input
      {...rest}
      name={local.name}
      class={`siam-input ${local.class ?? ""}`.trim()}
      aria-invalid={local.error ? true : undefined}
      aria-describedby={fieldDescribedBy(
        local.name,
        local.error,
        local.hint,
        local.describedByExtra,
      )}
    />
  );
}
