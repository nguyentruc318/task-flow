import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name is required").max(100),
});
export const workspaceActiveBodySchema = z.object({
  workspaceId: z.string().uuid(),
});
export type WorkspaceSchema = z.infer<typeof workspaceSchema>;
export type WorkspaceActiveBodySchema = z.infer<
  typeof workspaceActiveBodySchema
>;
