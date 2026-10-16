import { useLocation, type RouteSectionProps } from "@solidjs/router";
import Nav from "~/components/Nav";
import LandingHomeFooter from "~/components/landing/LandingHomeFooter";
import { homeContent } from "~/content";
import { PublicSiteProvider } from "~/lib/site/PublicSiteProvider";

export default function PublicLayout(props: RouteSectionProps) {
  const location = useLocation();
  const profiles = () =>
    location.pathname === "/" ? homeContent.profiles : undefined;

  return (
    <PublicSiteProvider>
      <div class="flex min-h-screen flex-col bg-canvas">
        <Nav />
        <main
          id="main"
          class="flex-1 w-full bg-canvas pt-[var(--siam-public-header-height)]"
        >
          {props.children}
        </main>
        <LandingHomeFooter profiles={profiles()} />
      </div>
    </PublicSiteProvider>
  );
}
