import { query } from "@solidjs/router";
import { contactPublicApi } from "../../endpoints/public/contact.api";

export const getPublicContactConfig = query(
  () => contactPublicApi.getConfig(),
  "public-contact-config",
);
