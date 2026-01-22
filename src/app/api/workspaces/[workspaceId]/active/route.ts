import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase-client";
import { failure } from "@/types/api.response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ workspaceId: string }>;
  },
) {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const { workspaceId } = await params;
  console.log("workspaceId", workspaceId);
  if (!workspaceId) {
    return failure("INVALID_DATA", "workspaceId is required", 400);
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return failure("UNAUTHORIZED", "User not logged in", 401);
  }

  const member = await prisma.workspaceMember.findFirst({
    where: { workspaceId, userId: user.id },
  });
  if (!member) {
    return failure("FORBIDDEN", "User is not a member of this workspace", 403);
  }
  cookieStore.set("active_workspace", workspaceId, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  return NextResponse.json(
    { message: "Workspace activated successfully" },
    { status: 200 },
  );
}
