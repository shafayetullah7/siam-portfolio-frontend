import { useLocation } from "@solidjs/router";
import type { JSX } from "solid-js";
import { Show } from "solid-js";
import PublicFooter from "./PublicFooter";

export default function PublicShell(props: { children: JSX.Element }) {
  const location = useLocation();
  const isHome = () => location.pathname === "/";

  return (
    <div class={`flex flex-col ${isHome() ? "min-h-screen" : "min-h-[calc(100vh-3.5rem)]"}`}>
      {props.children}
      <Show when={!isHome()}>
        <PublicFooter />
      </Show>
    </div>
  );
}
