import { z } from "zod";

export const createColumnSchema = z.object({
  boardId: z.string().uuid("Invalid board id"),
  name: z
    .string()
    .min(1, "Column name is required")
    .max(50, "Column name is too long"),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export const updateColumnSchema = z.object({
  name: z
    .string()
    .min(1, "Column name is required")
    .max(50, "Column name is too long"),
});

export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
export const columnIdSchema = z.object({
  id: z.string().uuid("Invalid column id"),
});
