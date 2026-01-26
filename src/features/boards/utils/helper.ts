import { Active, Over } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { QueryClient } from "@tanstack/react-query";
import { BoardDetail } from "../types/board.type";
import { ApiSuccess } from "@/types/api.response";

export function handleDragTaskEnd({
  activeData,
  queryClient,
  active,
  over,
}: {
  activeData: { type: "TASK"; columnId: string; boardId: string };
  queryClient: QueryClient;
  active: Active;
  over: Over;
}) {
  if (!over) return;

  queryClient.setQueryData(
    ["board-detail", activeData.boardId],
    (old: ApiSuccess<BoardDetail>) => {
      if (!old) return old;

      const sourceColumnId = activeData.columnId;

      // 🔹 xác định destinationColumnId
      let destinationColumnId: string | null = null;

      if (over.data.current?.type === "TASK") {
        destinationColumnId = over.data.current.columnId;
      } else if (over.data.current?.type === "COLUMN") {
        destinationColumnId = over.id as string;
      }

      if (!destinationColumnId) return old;

      const sourceColumn = old.data.columns.find(
        (c) => c.id === sourceColumnId,
      );
      const destinationColumn = old.data.columns.find(
        (c) => c.id === destinationColumnId,
      );

      if (!sourceColumn || !destinationColumn) return old;

      // 🔹 SAME COLUMN → reorder
      if (sourceColumnId === destinationColumnId) {
        const oldIndex = sourceColumn.tasks.findIndex(
          (t) => t.id === active.id,
        );
        const newIndex = sourceColumn.tasks.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return old;

        const reorderedTasks = arrayMove(
          sourceColumn.tasks,
          oldIndex,
          newIndex,
        ).map((task, index) => ({
          ...task,
          orderIndex: index,
        }));

        return {
          ...old,
          data: {
            ...old.data,
            columns: old.data.columns.map((col) =>
              col.id === sourceColumn.id
                ? { ...col, tasks: reorderedTasks }
                : col,
            ),
          },
        };
      }

      // 🔹 DIFF COLUMN → remove + insert
      const oldIndex = sourceColumn.tasks.findIndex((t) => t.id === active.id);
      if (oldIndex === -1) return old;

      const taskToMove = sourceColumn.tasks[oldIndex];

      const sourceTasks = [...sourceColumn.tasks];
      const targetTasks = [...destinationColumn.tasks];

      sourceTasks.splice(oldIndex, 1);

      let newIndex = targetTasks.findIndex((t) => t.id === over.id);
      if (newIndex === -1) newIndex = targetTasks.length;

      targetTasks.splice(newIndex, 0, {
        ...taskToMove,
        columnId: destinationColumnId,
      });

      const reindexedSourceTasks = sourceTasks.map((t, i) => ({
        ...t,
        orderIndex: i,
      }));
      const reindexedTargetTasks = targetTasks.map((t, i) => ({
        ...t,
        orderIndex: i,
      }));

      return {
        ...old,
        data: {
          ...old.data,
          columns: old.data.columns.map((col) => {
            if (col.id === sourceColumnId) {
              return { ...col, tasks: reindexedSourceTasks };
            }
            if (col.id === destinationColumnId) {
              return { ...col, tasks: reindexedTargetTasks };
            }
            return col;
          }),
        },
      };
    },
  );
}
