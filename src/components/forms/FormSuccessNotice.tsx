import { Show } from "solid-js";

export default function FormSuccessNotice(props: { message?: string | null }) {
  return (
    <Show when={props.message}>
      <p class="text-sm text-success" role="status">{props.message}</p>
    </Show>
  );
}
