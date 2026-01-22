import { http } from "@/lib/http-client";
import { WorkspaceSchema } from "../schemas/workspace.schema";
import { Workspace } from "../types/workspace.type";
import { ApiSuccess } from "@/types/api.response";

const workspaceApiRequest = {
  list: () => http.get<ApiSuccess<Workspace[]>>("/workspaces"),
  getActiveWorkspace: () =>
    http.get<ApiSuccess<Omit<Workspace, "createdAt">>>("/workspaces/active"),
  setActiveWorkspace: (workspaceId: string) =>
    http.post(`/workspaces/${workspaceId}/active`),
  create: (body: WorkspaceSchema) => http.post("/workspaces", body),
};
export default workspaceApiRequest;
