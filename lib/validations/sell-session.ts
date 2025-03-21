import * as z from "zod";

export const sellSessionSchema = z.object({
  name: z.string(),
  sellStop: z.boolean().optional(),
  showBanner: z.boolean().optional(),
  bannerTitle: z.string().optional(),
  description: z.string().optional(),
});
