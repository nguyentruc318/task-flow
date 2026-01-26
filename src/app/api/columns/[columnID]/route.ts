import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-client";
import { failure, success } from "@/types/api.response";
import {
  columnIdSchema,
  updateColumnSchema,
} from "@/features/boards/schema/board.schema";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ columnID: string }>;
  },
) {
  /* 1️⃣ Auth */
  const { columnID } = await params;
  const cookiesStore = await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return failure("UNAUTHORIZED", "User not logged in", 401);
  }

  /* 2️⃣ Validate column id */
  const parsedId = columnIdSchema.safeParse({ id: columnID });
  if (!parsedId.success) {
    return failure("INVALID_ID", "Invalid column id", 400);
  }

  /* 3️⃣ Validate body */
  const body = await req.json();
  const parsedBody = updateColumnSchema.safeParse(body);

  if (!parsedBody.success) {
    return failure("INVALID_DATA", "Invalid column data", 400);
  }

  const { name } = parsedBody.data;

  /* 4️⃣ Get active workspace */
  const workspaceId = cookiesStore.get("active_workspace")?.value;
  if (!workspaceId) {
    return failure("NO_WORKSPACE", "No active workspace", 400);
  }

  /* 5️⃣ Load column + board */
  const column = await prisma.column.findFirst({
    where: { id: columnID },
    include: {
      board: true,
    },
  });

  if (!column || column.board.workspaceId !== workspaceId) {
    return failure("NOT_FOUND", "Column not found", 404);
  }

  /* 6️⃣ Verify permission */
  const member = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: user.id,
      role: { in: ["owner", "editor"] },
    },
  });

  if (!member) {
    return failure("FORBIDDEN", "No permission to update column", 403);
  }

  /* 7️⃣ Update column */
  const updated = await prisma.column.update({
    where: { id: columnID },
    data: { name },
  });

  return success(updated);
}
export async function DELETE(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{ columnID: string }>;
  },
) {
  /* 1️⃣ Auth */
  const { columnID } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const cookiesStore = await cookies();
  if (!user) {
    return failure("UNAUTHORIZED", "User not logged in", 401);
  }

  /* 2️⃣ Validate id */
  const parsedId = columnIdSchema.safeParse({ id: columnID });
  if (!parsedId.success) {
    return failure("INVALID_ID", "Invalid column id", 400);
  }

  /* 3️⃣ Get active workspace */
  const workspaceId = cookiesStore.get("active_workspace")?.value;
  if (!workspaceId) {
    return failure("NO_WORKSPACE", "No active workspace", 400);
  }

  /* 4️⃣ Load column + board */
  const column = await prisma.column.findFirst({
    where: { id: columnID },
    include: {
      board: true,
    },
  });

  if (!column || column.board.workspaceId !== workspaceId) {
    return failure("NOT_FOUND", "Column not found", 404);
  }

  /* 5️⃣ Verify permission */
  const member = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: user.id,
      role: { in: ["owner", "editor"] },
    },
  });

  if (!member) {
    return failure("FORBIDDEN", "No permission to delete column", 403);
  }

  /* 6️⃣ Delete column (tasks cascade) */
  await prisma.column.delete({
    where: { id: columnID },
  });

  return success({ message: "Column deleted successfully" });
}
