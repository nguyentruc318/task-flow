import { z } from "zod";

export const createTaskSchema = z.object({
  columnId: z.string().uuid("Invalid column id"),

  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title is too long"),

  description: z.string().max(1000, "Description is too long").optional(),

  priority: z.enum(["low", "medium", "high"]).optional(),

  startDate: z.string().datetime("Invalid start date").optional(),

  dueDate: z.string().datetime("Invalid due date").optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const taskIdSchema = z.object({
  id: z.string().uuid("Invalid task id"),
});
