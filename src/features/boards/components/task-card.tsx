// TaskCard.tsx
import { Badge } from "@/components/ui/badge";
import { Task } from "../types/board.type";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-md bg-background p-3 shadow-sm hover:shadow transition">
      <p className="text-sm font-medium">{task.title}</p>

      <div className="mt-2 flex items-center gap-2">
        <Badge variant="secondary">{task.priority}</Badge>
        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
