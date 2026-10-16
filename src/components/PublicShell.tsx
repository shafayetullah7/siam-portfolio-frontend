import type { JSX } from "solid-js";
import PublicFooter from "./PublicFooter";

export default function PublicShell(props: { children: JSX.Element }) {
  return (
    <div class="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {props.children}
      <PublicFooter />
    </div>
  );
}
