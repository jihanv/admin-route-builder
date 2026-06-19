import "server-only";

import { z } from "zod";

export const routePointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
