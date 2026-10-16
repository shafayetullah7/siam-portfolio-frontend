import { A } from "@solidjs/router";
import type { HomeProjectHighlight } from "~/content";
import { ArrowExternal } from "~/icons";
import LandingSectionHeader from "./LandingSectionHeader";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";
import ProjectCardGrid from "./ProjectCardGrid";

export type FeaturedProjectsSectionProps = {
  items: readonly HomeProjectHighlight[];
};

export default function FeaturedProjectsSection(props: FeaturedProjectsSectionProps) {
  const meta = HOME_SECTION_LABELS.featuredProjects;

  return (
    <section
      id={meta.domId}
      class="scroll-mt-24 flex w-full flex-col gap-5"
      aria-labelledby={`${meta.domId}-heading`}
    >
      <LandingSectionHeader
        headingId={`${meta.domId}-heading`}
        sectionEyebrow={meta.sectionEyebrow ?? "03 // ARTIFACTS & SYSTEMS"}
        title={meta.title}
        aside={
          <div class="flex flex-col items-end gap-2">
            <A
              href="https://github.com/"
              class="inline-flex items-center gap-1 font-mono text-xs text-primary no-underline hover:underline"
            >
              Explore GitHub
              <ArrowExternal class="size-4" aria-hidden="true" />
            </A>
            <A href="/projects" class="font-mono text-xs text-primary no-underline hover:underline">
              View all projects →
            </A>
          </div>
        }
      />
      <ProjectCardGrid items={props.items} />
    </section>
  );
}
