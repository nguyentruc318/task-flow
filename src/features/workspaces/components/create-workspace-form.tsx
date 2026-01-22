"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WorkspaceSchema,
  workspaceSchema,
} from "@/features/workspaces/schemas/workspace.schema";
import { useCreateWorkspace } from "@/features/workspaces/hooks/useWorkspace";
export default function CreateWorkspaceForm() {
  const { createWorkspace, error, isLoading } = useCreateWorkspace();
  const form = useForm<WorkspaceSchema>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });
  return (
    <>
      <form
        onSubmit={form.handleSubmit((data) => {
          createWorkspace(data);
          form.reset();
        })}
        className="space-y-4"
      >
        <div>
          <Label className="mb-3" htmlFor="name">
            Workspace name
          </Label>
          <Input id="name" {...form.register("name")} placeholder="My Team" />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          Create workspace
        </Button>
      </form>
    </>
  );
}
