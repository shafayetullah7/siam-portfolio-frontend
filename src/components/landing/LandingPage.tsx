import type { JSX } from "solid-js";
import type { HomePageContent } from "~/content";
import HomeLandingSections from "./HomeLandingSections";

export type LandingPageProps = {
  content: HomePageContent;
  devFooter?: JSX.Element;
};

export default function LandingPage(props: LandingPageProps) {
  return (
    <main id="main" class="siam-container py-12 sm:py-16">
      <div class="flex flex-col gap-12 sm:gap-16">
        <HomeLandingSections content={props.content} />
        {props.devFooter}
      </div>
    </main>
  );
}
