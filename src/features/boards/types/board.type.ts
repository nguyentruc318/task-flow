export type Board = {
  id: string;
  name: string;
  createdAt: Date;
};
export type BoardList = Board[];
export type BoardDetail = {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: string; // ISO 8601 date string
  columns: Column[];
};

export type Column = {
  id: string;
  boardId: string;
  name: string;
  orderIndex: number;
  createdAt: string; // ISO 8601 date string
  tasks: Task[];
};

export type Task = {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  orderIndex: number;
  priority: "high" | "medium" | "low"; // hoặc string nếu có nhiều giá trị khác
  assigneeId: string | null;
  createdBy: string;
  dueDate: string | null; // ISO 8601 date string
  startDate: string | null; // ISO 8601 date string
  completedAt: string | null; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
};
