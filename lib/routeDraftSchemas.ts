import "server-only";

import { z } from "zod";

export const routePointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const missionMilestoneSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1),
  description: z.string(),
  distanceMeters: z.number(),
  position: routePointSchema,
  imageUrls: z.array(z.string()),
});

export const routeDraftMilestoneImageAssetSchema = z.object({
  milestoneId: z.string(),
  imageUrl: z.url(),
  cloudinaryPublicId: z.string(),
});

export const heroBannerImageAssetSchema = z.object({
  imageUrl: z.url(),
  cloudinaryPublicId: z.string(),
});
