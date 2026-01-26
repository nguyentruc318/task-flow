import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTaskInput } from "../schema/task.schema";
import { taskApi } from "../services/task.service";

export function useTaskColumn(boardId: string) {
  const queryClient = useQueryClient();

  const { mutate: createTask, isPending } = useMutation({
    mutationFn: (body: CreateTaskInput) => taskApi.create(body),
    onSuccess: () => {
      // Board detail query sẽ refetch columns + tasks
      queryClient.invalidateQueries({
        queryKey: ["board-detail", boardId],
      });
    },
  });
  return { createTask, isLoading: isPending };
}
