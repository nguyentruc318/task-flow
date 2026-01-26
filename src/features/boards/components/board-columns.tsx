"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { BoardDetail, Column } from "../types/board.type";
import ColumnCard from "./column-card";
import { ApiSuccess } from "@/types/api.response";

export default function BoardColumns({
  columns,
  boardId,
}: {
  columns: Column[];
  boardId: string;
}) {
  const queryClient = useQueryClient();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const activeData = active.data.current as
      | { type: "TASK"; columnId: string }
      | undefined;

    if (!activeData || activeData.type !== "TASK") return;

    queryClient.setQueryData(
      ["board-detail", boardId],
      (old: ApiSuccess<BoardDetail>) => {
        if (!old) return old;

        const column = old.data.columns.find(
          (c) => c.id === activeData.columnId,
        );
        if (!column) return old;

        const oldIndex = column.tasks.findIndex((t) => t.id === active.id);

        const newIndex = column.tasks.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return old;

        const reorderedTasks = arrayMove(column.tasks, oldIndex, newIndex).map(
          (task, index) => ({
            ...task,
            orderIndex: index,
          }),
        );

        return {
          ...old,
          data: {
            ...old.data,
            columns: old.data.columns.map((col) =>
              col.id === column.id ? { ...col, tasks: reorderedTasks } : col,
            ),
          },
        };
      },
    );
  }

  // 🔹 DIFFERENT COLUMN (làm sau)

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((col) => (
          <ColumnCard key={col.id} column={col} boardId={boardId} />
        ))}
      </div>
    </DndContext>
  );
}
