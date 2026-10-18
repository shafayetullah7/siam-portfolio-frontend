import { Show, type JSX } from "solid-js";
import { adminPageDescriptionClass, adminPageTitleClass } from "./adminTypography";

export type AdminPageHeaderProps = {
  title: string;
  description?: string;
  children?: JSX.Element;
};

/** Page title block for authenticated admin routes (inside main#main). */
export default function AdminPageHeader(props: AdminPageHeaderProps) {
  return (
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class={adminPageTitleClass}>{props.title}</h1>
        <Show when={props.description}>
          <p class={adminPageDescriptionClass}>{props.description}</p>
        </Show>
      </div>
      <Show when={props.children}>
        <div class="shrink-0">{props.children}</div>
      </Show>
    </header>
  );
}
