import { http } from "@/lib/http-client";

import { ApiSuccess } from "@/types/api.response";
import { Task } from "../types/board.type";
import { CreateTaskInput } from "../schema/task.schema";

export const taskApi = {
  create: (body: CreateTaskInput) =>
    http.post<ApiSuccess<Task>>("/tasks", body),
};
