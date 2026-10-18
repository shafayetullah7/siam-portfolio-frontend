import type { JSX } from "solid-js";

/** Max-width content column inside admin `main#main` (uses site content tokens). */
export default function AdminPageContainer(props: { children: JSX.Element }) {
  return <div class="siam-container w-full flex-1 py-8">{props.children}</div>;
}
