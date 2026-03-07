import { z } from "zod";

export const schema = z.object({
  urls: z.array(z.string().url()).min(1, "At least one URL must be provided"),
});
