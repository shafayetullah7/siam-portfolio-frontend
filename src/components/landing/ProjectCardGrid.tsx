import { For } from "solid-js";
import type { HomeProjectHighlight } from "~/content";
import ProjectCard, { type ProjectCardAccent } from "./ProjectCard";

export type ProjectCardGridProps = {
  items: readonly HomeProjectHighlight[];
};

function accentForIndex(index: number): ProjectCardAccent {
  return index % 2 === 0 ? "project" : "research";
}

export default function ProjectCardGrid(props: ProjectCardGridProps) {
  return (
    <ul class="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3" role="list">
      <For each={props.items}>
        {(item, index) => (
          <li>
            <ProjectCard item={item} accent={accentForIndex(index())} />
          </li>
        )}
      </For>
    </ul>
  );
}
