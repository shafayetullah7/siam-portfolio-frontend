import { publicClient } from "../../public-client";
import type { PublicContactConfig } from "../../types/contact.types";
import type { ContactInquiryInput } from "~/lib/forms/schemas/contact-inquiry.schema";

export type ContactSubmitResponse = {
  acknowledged: true;
};

export const contactPublicApi = {
  getConfig: () =>
    publicClient.get<PublicContactConfig>("/contact/config"),

  submit: (body: ContactInquiryInput) =>
    publicClient.post<ContactSubmitResponse>("/contact", body),
};
