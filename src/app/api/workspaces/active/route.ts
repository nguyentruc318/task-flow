import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase-client";
import { failure, success } from "@/types/api.response";

import { cookies } from "next/headers";
export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return failure("UNAUTHORIZED", "User not logged in", 401);
  }

  let activeWorkspaceId = cookieStore.get("active_workspace")?.value;

  // Nếu không có active workspace, lấy workspace đầu tiên của user
  if (!activeWorkspaceId) {
    const firstMember = await prisma.workspaceMember.findFirst({
      where: { userId: user.id },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!firstMember) {
      return failure("BAD_REQUEST", "User has no workspace", 400);
    }

    activeWorkspaceId = firstMember.workspace.id;
    cookieStore.set("active_workspace", activeWorkspaceId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return success(
      {
        id: firstMember.workspace.id,
        name: firstMember.workspace.name,
        role: firstMember.role,
      },
      200,
    );
  }

  const member = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: activeWorkspaceId,
      userId: user.id,
    },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!member) {
    cookieStore.delete("active_workspace");
    return failure("FORBIDDEN", "User is not a member of this workspace", 403);
  }
  return success(
    {
      id: member.workspace.id,
      name: member.workspace.name,
      role: member.role,
    },
    200,
  );
}
