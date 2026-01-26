import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase-client";
import { failure, success } from "@/types/api.response";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ boardId: string }>;
  },
) {
  //   const cookieStore = await cookies();
  const supabase = await createClient();
  const { boardId } = await params;

  if (!boardId) {
    return failure("INVALID_DATA", "boardId is required", 400);
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return failure("UNAUTHORIZED", "User not logged in", 401);
  }

const board = await prisma.board.findFirst({
  where: { id: boardId },
  include: {
    columns: {
      orderBy: { orderIndex: "asc" },
      include: {
        tasks: {
          orderBy: { orderIndex: "asc" },
        },
      },
    },
  },
});
  if (!board) {
    return failure("FORBIDDEN", "User is not a member of this workspace", 403);
  }

  return success(board);
}
