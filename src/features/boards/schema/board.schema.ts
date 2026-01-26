import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().min(2, "Board name is required").max(100),
});
export type CreateBoardSchema = z.infer<typeof createBoardSchema>;
