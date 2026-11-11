/** Keep in sync with siam-api/src/domain/profile-home/featured-on-home.constants.ts */
export const FEATURED_ON_HOME_CAPS = {
  research: 6,
  publications: 4,
  projects: 3,
} as const;

export const FEATURED_ON_HOME_MIN = {
  research: 3,
  publications: 2,
  projects: 2,
} as const;
