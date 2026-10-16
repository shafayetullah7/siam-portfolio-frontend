import { listProjects, projectToHomeItem } from "~/content";
import ProjectCardGrid from "~/components/landing/ProjectCardGrid";

export default function ProjectCatalogGrid() {
  const items = listProjects().map(projectToHomeItem);
  return <ProjectCardGrid items={items} />;
}
