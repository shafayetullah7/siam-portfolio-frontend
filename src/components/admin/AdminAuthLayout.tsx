import { children, Show, type JSX } from "solid-js";
import AdminAuthFooterLinks from "./AdminAuthFooterLinks";
import AdminAuthWordmark from "./AdminAuthWordmark";
import { adminPageDescriptionClass, adminPageTitleClass } from "./adminTypography";

export type AdminAuthLayoutProps = {
  title: string;
  description?: string;
  children: JSX.Element;
  /** Contextual auth links; Public site link is always appended via AdminAuthFooterLinks. */
  footer?: JSX.Element;
};

/** Centered card for all public admin auth routes (login, register, verify, forgot, reset). */
export default function AdminAuthLayout(props: AdminAuthLayoutProps) {
  const footer = children(() => props.footer);

  return (
    <div class="flex min-h-full w-full flex-col items-center bg-surface-muted px-4 py-8 sm:py-10">
      <AdminAuthWordmark />

      <div class="siam-card w-full max-w-md overflow-hidden">
        <div class="h-1 bg-primary" />
        <div class="px-6 py-8 sm:px-8">
          <h1 class={adminPageTitleClass}>{props.title}</h1>
          <Show when={props.description}>
            <p class={adminPageDescriptionClass}>{props.description}</p>
          </Show>
          {props.children}
        </div>
      </div>

      <div class="mt-6 w-full max-w-md">
        <AdminAuthFooterLinks>{footer()}</AdminAuthFooterLinks>
      </div>
    </div>
  );
}
