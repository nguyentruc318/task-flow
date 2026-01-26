import { http } from "@/lib/http-client";
import { Board, BoardDetail, BoardList } from "../types/board.type";
import { CreateBoardSchema } from "../schema/board.schema";
import { ApiSuccess } from "@/types/api.response";

const boardApiRequest = {
  list: () => http.get<ApiSuccess<BoardList>>("/boards"),
  getDetail: (boardId: string) =>
    http.get<ApiSuccess<BoardDetail>>(`/boards/${boardId}`),
  create: (body: CreateBoardSchema) =>
    http.post<ApiSuccess<Board>>("/boards", body),
  delete: (boardId: string) => http.delete(`/boards/${boardId}`),
};
export default boardApiRequest;
