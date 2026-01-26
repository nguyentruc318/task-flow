import { createBoardSchema } from "@/features/boards/schema/board.schema";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase-client";
import { failure, success } from "@/types/api.response";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return failure("UNAUTHORIZED", "Not logged in", 401);

  const workspaceId = cookieStore.get("active_workspace")?.value;
  if (!workspaceId) return failure("BAD_REQUEST", "No active workspace", 400);

  const member = await prisma.workspaceMember.findFirst({
    where: { workspaceId, userId: user.id },
  });
  if (!member) return failure("FORBIDDEN", "Not member", 403);
  const boards = await prisma.board.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });
  return success(boards);
}
export async function POST(req: NextRequest) {
  const cookiesStore = await cookies();
  const body = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return failure("UNAUTHORIZED", "Not logged in", 401);
  const workspaceId = cookiesStore.get("active_workspace")?.value;
  if (!workspaceId) return failure("BAD_REQUEST", "No active workspace", 400);
  const parsed = createBoardSchema.safeParse(body);
  if (!parsed.success) {
    return failure("BAD_REQUEST", "Invalid body data", 400);
  }
  const board = await prisma.board.create({
    data: {
      name: parsed.data.name,
      workspaceId,
      createdAt: new Date(),
    },
  });
  return success(board, 201);
}
