import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import workspaceApiRequest from "../services/workspace.service";
import { WorkspaceSchema } from "../schemas/workspace.schema";

export function useGetListWorkspace() {
  const {
    data: response,
    isPending,
    error,
  } = useQuery({
    queryKey: ["workspaces-list"],
    queryFn: () => workspaceApiRequest.list(),
  });
  const listWorkspaces = response?.data || [];
  return {
    listWorkspaces,
    isLoading: isPending,
    error,
  };
}
export function useGetActiveWorkspace() {
  const {
    data: response,
    isPending,
    error,
  } = useQuery({
    queryKey: ["workspaces-active"],
    queryFn: () => workspaceApiRequest.getActiveWorkspace(),
  });
  const data = response?.data;
  return {
    data,
    isLoading: isPending,
    error,
  };
}
export function useSetActiveWorkspace() {
  const queryClient = useQueryClient();
  const {
    mutate: mutateSetActive,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["workspaces"],
    mutationFn: (id: string) => workspaceApiRequest.setActiveWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces-active"] });
    },
  });
  return {
    mutateSetActive,
    isLoading: isPending,
    error,
  };
}
export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const { data, isPending, error, mutate } = useMutation({
    mutationKey: ["workspaces-create"],
    mutationFn: (body: WorkspaceSchema) => workspaceApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces-list"] });
    },
  });
  return {
    data,
    isLoading: isPending,
    error,
    createWorkspace: mutate,
  };
}
