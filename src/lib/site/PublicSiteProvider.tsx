import { Link } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import {
  createContext,
  type ParentProps,
  Show,
  useContext,
} from "solid-js";
import { getPublicSite } from "~/lib/api/queries/public";
import type { PublicSitePayload } from "./public-site.types";

type PublicSiteContextValue = {
  site: () => PublicSitePayload | undefined;
};

const PublicSiteContext = createContext<PublicSiteContextValue>();

function PublicSiteHead(props: { faviconUrl: () => string | null | undefined }) {
  const href = () => props.faviconUrl();
  return (
    <Show when={href()}>
      <Link rel="icon" href={href()!} />
    </Show>
  );
}

export function PublicSiteProvider(props: ParentProps) {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const value: PublicSiteContextValue = { site };

  return (
    <PublicSiteContext.Provider value={value}>
      <PublicSiteHead faviconUrl={() => site()?.faviconUrl} />
      {props.children}
    </PublicSiteContext.Provider>
  );
}

export function usePublicSite(): PublicSiteContextValue {
  const ctx = useContext(PublicSiteContext);
  if (!ctx) {
    throw new Error("usePublicSite must be used within PublicSiteProvider");
  }
  return ctx;
}
