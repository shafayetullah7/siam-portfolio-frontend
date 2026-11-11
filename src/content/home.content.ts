/**
 * Dev / unpublished homepage fallback only.
 * Publish from /admin/home — published `/` uses GET public/home (HOME6).
 */
import type { HomePageContent } from "./home.types";

export const homeContent: HomePageContent = {
  hero: {
    name: "Homepage not published",
    descriptor: "Publish the homepage in admin to show your live landing content.",
    positioning: "",
    portrait: null,
    primaryCta: { label: "Explore research", href: "/research" },
    secondaryCta: { label: "Get in touch", href: "/contact" },
  },
  seo: {
    title: "Home",
    description: "Publish the homepage from admin to replace this placeholder.",
  },
};
