import { query } from "@solidjs/router";
import {
  projectsPublicApi,
  type PublicProjectsListParams,
} from "../../endpoints/public/projects.api";
import { isApiError } from "../../errors";

function projectsListCacheKey(params: PublicProjectsListParams = {}) {
  return JSON.stringify({
    q: params.q ?? "",
    tag: params.tag ?? "",
    projectType: params.projectType ?? "",
    projectStatus: params.projectStatus ?? "",
    page: params.page ?? "",
    limit: params.limit ?? "",
    featured: params.featured ?? "",
    excludeFeatured: params.excludeFeatured ?? "",
  });
}

export const getPublicProjects = query(
  async (params: PublicProjectsListParams = {}) => {
    return await projectsPublicApi.list(params);
  },
  "public-projects",
);

getPublicProjects.keyFor = (params: PublicProjectsListParams = {}) =>
  `public-projects:${projectsListCacheKey(params)}`;

export const getPublicProjectBySlug = query(
  async (slug: string) => {
    try {
      return await projectsPublicApi.bySlug(slug);
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        return null;
      }
      throw error;
    }
  },
  "public-project",
);

getPublicProjectBySlug.keyFor = (slug: string) => `public-project:${slug}`;
