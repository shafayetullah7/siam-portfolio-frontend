import { Show } from "solid-js";

export default function FormErrorAlert(props: { message?: string | null }) {
  return (
    <Show when={props.message}>
      <p class="siam-alert-error" role="alert">{props.message}</p>
    </Show>
  );
}
