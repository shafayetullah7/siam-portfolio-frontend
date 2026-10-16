import type { JSX } from "solid-js";
import type { HomePageContent } from "~/content";
import LandingHomeFooter from "./LandingHomeFooter";
import HomeLandingSections from "./HomeLandingSections";

export type LandingPageProps = {
  content: HomePageContent;
  devFooter?: JSX.Element;
};

export default function LandingPage(props: LandingPageProps) {
  return (
    <>
      <main id="main" class="w-full bg-canvas pt-20">
        <div
          class="mx-auto flex w-full max-w-[var(--siam-content-width-wide)] flex-col gap-10 px-[var(--siam-gutter)] py-6 sm:gap-14 sm:py-8 lg:px-[var(--siam-gutter-desktop)]"
        >
          <HomeLandingSections content={props.content} />
          {props.devFooter}
        </div>
      </main>
      <LandingHomeFooter profiles={props.content.profiles} />
    </>
  );
}
