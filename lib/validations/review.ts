import { ReviewState } from "@prisma/client";
import * as z from "zod";

export const reviewSchema = z.object({
  userId: z.string(),
  productId: z.string().optional(),
  job: z.string().min(3).max(32),
  location: z.string().min(3).max(32),
  rating: z.number().min(1).max(5),
  approved: z.nativeEnum(ReviewState).optional(),
  comment: z.string().min(3).max(500),
});
