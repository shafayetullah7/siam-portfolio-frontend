import { splitProps, type JSX } from "solid-js";
import { fieldDescribedBy } from "./FormField";

export type FormTextareaProps = {
  name: string;
  error?: string;
  hint?: string;
} & JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function FormTextarea(props: FormTextareaProps) {
  const [local, rest] = splitProps(props, ["name", "error", "hint", "class"]);
  return (
    <textarea
      {...rest}
      name={local.name}
      class={`siam-textarea ${local.class ?? ""}`.trim()}
      aria-invalid={local.error ? true : undefined}
      aria-describedby={fieldDescribedBy(local.name, local.error, local.hint)}
    />
  );
}
