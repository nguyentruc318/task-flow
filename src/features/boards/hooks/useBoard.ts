import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import boardApiRequest from "../services/board.service";
import { CreateBoardSchema } from "../schema/board.schema";


export function useGetListBoard() {
  const {
    data: response,
    isPending,
    error,
  } = useQuery({
    queryKey: ["boards-list"],
    queryFn: () => boardApiRequest.list(),
  });
  const listBoards = response?.data || [];
  return {
    listBoards,
    isLoading: isPending,
    error,
  };
}

export function useGetBoardDetail(boardId: string | undefined) {
  const {
    data: boardDetail,
    isPending,
    error,
  } = useQuery({
    queryKey: ["board-detail", boardId],
    queryFn: () => boardApiRequest.getDetail(boardId!),
    enabled: !!boardId,
  });

  return {
    boardDetail,
    isLoading: isPending,
    error,
  };
}
export function useCreateBoard() {
  const queryClient = useQueryClient();
  const { data, isPending, error, mutate } = useMutation({
    mutationKey: ["boards-create"],
    mutationFn: (body: CreateBoardSchema) => boardApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards-list"] });
    },
  });
  return {
    data,
    isLoading: isPending,
    error,
    createBoard: mutate,
  };
}
export function useDeleteBoard(boardId: string | undefined) {
  const {
    isPending,
    error,

    mutate: deleteMutate,
  } = useMutation({
    mutationKey: ["board-detail", boardId],
    mutationFn: () => boardApiRequest.delete(boardId!),
  });
  return {
    isLoading: isPending,
    error,
    deleteMutate,
  };
}
