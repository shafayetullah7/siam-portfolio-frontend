import { query } from "@solidjs/router";
import { sitePublicApi } from "../../endpoints/public/site.api";

/** Site chrome + nav; revalidate after admin site settings or page publish. */
export const getPublicSite = query(
  () => sitePublicApi.get(),
  "public-site",
);

export const getPublicHome = query(
  () => sitePublicApi.home(),
  "public-home",
);

export const getPublicAbout = query(
  () => sitePublicApi.about(),
  "public-about",
);
