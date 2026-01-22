"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useGetActiveWorkspace,
  useGetListWorkspace,
  useSetActiveWorkspace,
} from "../hooks/useWorkspace";
import { Workspace } from "../types/workspace.type";

export function WorkspaceSwitcher() {
  const { listWorkspaces, isLoading: loadingList } = useGetListWorkspace();

  const { data: activeWorkspace, isLoading: loadingActive } =
    useGetActiveWorkspace();

  const { mutateSetActive, isLoading: switching } = useSetActiveWorkspace();

  if (loadingList || loadingActive) {
    return <div className="px-4 py-2 text-sm">Loading...</div>;
  }

  if (!activeWorkspace) {
    return <div className="px-4 py-2 text-sm">No workspace</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={switching}
        >
          {activeWorkspace.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        {listWorkspaces?.map((ws: Workspace) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => {
              if (ws.id === activeWorkspace.id) return;
              mutateSetActive(ws.id);
            }}
            className="flex justify-between"
          >
            <span>{ws.name}</span>
            {ws.id === activeWorkspace.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
