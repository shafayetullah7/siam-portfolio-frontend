import { Show, type JSX } from "solid-js";
import { adminPageDescriptionClass, adminPageTitleClass } from "./adminTypography";

export type AdminPageHeaderProps = {
  title: string;
  description?: string;
  /** Place actions under the description (better for multi-step wizards). */
  stackActions?: boolean;
  children?: JSX.Element;
};

/** Page title block for authenticated admin routes (inside main#main). */
export default function AdminPageHeader(props: AdminPageHeaderProps) {
  const actions = () => (
    <Show when={props.children}>
      <div
        classList={{
          "flex max-w-full flex-wrap items-center gap-2": true,
          "shrink-0 justify-end": !props.stackActions,
          "mt-4": Boolean(props.stackActions),
        }}
      >
        {props.children}
      </div>
    </Show>
  );

  return (
    <Show
      when={props.stackActions}
      fallback={
        <header class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 class={adminPageTitleClass}>{props.title}</h1>
            <Show when={props.description}>
              <p class={adminPageDescriptionClass}>{props.description}</p>
            </Show>
          </div>
          {actions()}
        </header>
      }
    >
      <header>
        <h1 class={adminPageTitleClass}>{props.title}</h1>
        <Show when={props.description}>
          <p class={adminPageDescriptionClass}>{props.description}</p>
        </Show>
        {actions()}
      </header>
    </Show>
  );
}
