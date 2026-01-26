"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
} from "@dnd-kit/core";

import { useQueryClient } from "@tanstack/react-query";
import { Column, Task } from "../types/board.type";
import ColumnCard from "./column-card";

import { handleDragTaskEnd } from "../utils/helper";
import CreateColumnInline from "./create-column-form";
import { useState } from "react";
import TaskCard from "./task-card";

export default function BoardColumns({
  columns,
  boardId,
}: {
  columns: Column[];
  boardId: string;
}) {
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    // SAME COLUMN

    // REORDER TASSK IN COLUMN
    if (active.data.current?.type === "TASK") {
      handleDragTaskEnd({
        activeData: {
          type: "TASK",
          columnId: active.data.current.columnId,
          boardId: boardId,
        },
        queryClient,
        active,
        over,
      });
      return;
    }
  }
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    if (active.data.current?.type === "TASK") {
      setActiveTask(active.data.current.task);
    }
  }
  // 🔹 DIFFERENT COLUMN (làm sau)

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex gap-4 overflow-x-auto mt-4">
        {columns.map((col) => (
          <ColumnCard key={col.id} boardId={col.boardId} column={col} />
        ))}
        <CreateColumnInline boardId={boardId} />
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
