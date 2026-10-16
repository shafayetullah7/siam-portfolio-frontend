import type { HomeAffiliation, HomeHero } from "~/content";
import AffiliationStrip from "./AffiliationStrip";
import HeroBlock from "./HeroBlock";
import HeroShell from "./HeroShell";

export type HomeHeroRegionProps = {
  hero: HomeHero;
  affiliation?: HomeAffiliation;
};

export default function HomeHeroRegion(props: HomeHeroRegionProps) {
  return (
    <HeroShell>
      <HeroBlock hero={props.hero} />
      {props.affiliation ? (
        <div class="mt-8">
          <AffiliationStrip affiliation={props.affiliation} />
        </div>
      ) : null}
    </HeroShell>
  );
}
