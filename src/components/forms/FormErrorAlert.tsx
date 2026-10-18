import { Show } from "solid-js";

export default function FormErrorAlert(props: {
  message?: string | null;
  id?: string;
}) {
  return (
    <Show when={props.message}>
      <p
        id={props.id}
        class="siam-alert-error"
        role="alert"
        tabIndex={props.id ? -1 : undefined}
      >
        {props.message}
      </p>
    </Show>
  );
}
