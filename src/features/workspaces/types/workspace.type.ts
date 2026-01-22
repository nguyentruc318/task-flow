export type Workspace = {
  id: string;
  name: string;
  role: WorkspaceRole;
  createdAt: string;
};
export type WorkspaceRole = "owner" | "editor" | "viewer";
