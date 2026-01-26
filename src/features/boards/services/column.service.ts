// features/columns/services/column.service.ts
import { http } from "@/lib/http-client";
import { CreateColumnInput } from "../schema/column.schema";
import { ApiSuccess } from "@/types/api.response";
import { Column } from "../types/board.type";

export const columnApi = {
  create: (body: CreateColumnInput) =>
    http.post<ApiSuccess<Column>>("/columns", body),
};
