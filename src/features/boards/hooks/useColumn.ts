// features/columns/hooks/useColumns.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { columnApi } from "../services/column.service";
import { CreateColumnInput } from "../schema/column.schema";

export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();

  const { mutate: createColumnForm, isPending } = useMutation({
    mutationFn: (body: CreateColumnInput) => columnApi.create(body),
    onSuccess: () => {
      // Board detail query sẽ refetch columns + tasks
      queryClient.invalidateQueries({
        queryKey: ["board-detail", boardId],
      });
    },
  });
  return { createColumnForm, isLoading: isPending };
}
