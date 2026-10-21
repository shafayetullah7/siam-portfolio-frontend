import { publicClient } from "../../public-client";
import type { HealthResponse } from "../../types/public.types";

export const healthPublicApi = {
  get: () => publicClient.get<HealthResponse>("/health"),
};
