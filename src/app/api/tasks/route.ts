import { createTaskSchema } from "@/features/boards/schema/task.schema";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase-client";
import { failure, success } from "@/types/api.response";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookiesStore = await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return failure("UNAUTHORIZED", "User not logged in", 401);
  }

  const body = await req.json();
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return failure("INVALID_DATA", "Invalid task data", 400);
  }

  const { columnId, title, priority, description, dueDate, startDate } =
    parsed.data;
  const workspaceId = cookiesStore.get("active_workspace")?.value;
  if (!workspaceId) {
    return failure("NO_WORKSPACE", "No active workspace", 400);
  }

  /* 4️⃣ Load column → board → workspace */
  const column = await prisma.column.findFirst({
    where: { id: columnId },
    include: {
      board: true,
    },
  });

  if (!column || column.board.workspaceId !== workspaceId) {
    return failure("NOT_FOUND", "Column not found", 404);
  }

  /* 5️⃣ Permission check */
  const member = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: user.id,
      role: { in: ["owner", "editor"] },
    },
  });

  if (!member) {
    return failure("FORBIDDEN", "No permission to create task", 403);
  }
  /* 6️⃣ Compute orderIndex */
  const lastTask = await prisma.task.findFirst({
    where: { columnId },
    orderBy: { orderIndex: "desc" },
  });

  const orderIndex = lastTask ? lastTask.orderIndex + 1 : 0;

  const task = await prisma.task.create({
    data: {
      columnId,
      boardId: column.boardId,
      title,
      priority: priority ?? "medium",
      orderIndex,
      createdBy: user.id,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });
  return success(task, 201);
}
