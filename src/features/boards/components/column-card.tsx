import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CreateTaskInline from "./create-task-line";
import SortableTaskCard from "./sortable-card";
import { Column, Task } from "../types/board.type";

export default function ColumnCard({
  column,
  boardId,
}: {
  column: Column;
  boardId: string;
}) {
  const taskIds = column.tasks.map((t: Task) => t.id);

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-muted/40 p-3">
      <h3 className="mb-2 text-sm font-semibold">{column.name}</h3>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2">
          {column.tasks.map((task: Task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>

      <CreateTaskInline columnId={column.id} boardId={boardId} />
    </div>
  );
}
