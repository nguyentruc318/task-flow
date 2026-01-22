"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";

export default function CreateWorkspacePage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-lg font-semibold">Create a workspace</h1>
          <p className="text-sm text-muted-foreground">
            Workspaces help you organize boards and tasks.
          </p>
        </CardHeader>

        <CardContent>
          <CreateWorkspaceForm />
        </CardContent>
      </Card>
    </div>
  );
}
