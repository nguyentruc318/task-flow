import { createColumnSchema } from "@/features/boards/schema/column.schema";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase-client";
import { failure, success } from "@/types/api.response";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const cookiesStore = await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return failure("UNAUTHORIZED", "User not logged in", 401);
  }
  const body = await req.json();
  const parsed = createColumnSchema.safeParse(body);

  if (!parsed.success) {
    return failure("INVALID_DATA", "Invalid column data", 400);
  }
  const { boardId, name } = parsed.data;
  const workspaceId = cookiesStore.get("active_workspace")?.value;
  if (!workspaceId) {
    return failure("NO_WORKSPACE", "No active workspace", 400);
  }
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      workspaceId,
    },
  });
  if (!board) {
    return failure("NOT_FOUND", "Board not found", 404);
  }

  /* 5️⃣ Verify membership (editor / owner) */
  const member = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: user.id,
      role: { in: ["owner", "editor"] },
    },
  });

  if (!member) {
    return failure("FORBIDDEN", "No permission to create column", 403);
  }
  const lastColumn = await prisma.column.findFirst({
    where: { boardId },
    orderBy: { orderIndex: "desc" },
  });

  const orderIndex = lastColumn ? lastColumn.orderIndex + 1 : 0;

  /* 7️⃣ Create column */
  const column = await prisma.column.create({
    data: {
      boardId,
      name,
      orderIndex,
    },
  });

  return success(column, 201);
}
