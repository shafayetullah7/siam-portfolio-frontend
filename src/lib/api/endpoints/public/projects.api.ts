import { publicClient } from "../../public-client";
import type {
  ProjectPublicDetail,
  ProjectPublicList,
  ProjectStatus,
  ProjectType,
} from "../../types/project.types";

export type PublicProjectsListParams = {
  q?: string;
  tag?: string;
  projectType?: ProjectType;
  projectStatus?: ProjectStatus;
  page?: number;
  limit?: number;
  featured?: boolean;
  excludeFeatured?: boolean;
};

export const projectsPublicApi = {
  list: (params?: PublicProjectsListParams) =>
    publicClient.get<ProjectPublicList>("/projects", { params }),

  bySlug: (slug: string) =>
    publicClient.get<ProjectPublicDetail>(`/projects/${slug}`),
};
