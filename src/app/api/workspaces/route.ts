import { workspaceSchema } from "@/features/workspaces/schemas/workspace.schema";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase-client";
import { failure, success } from "@/types/api.response";
import { NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return failure("UNAUTHORIZED", "User not logged in", 401);
  }
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: user.id },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
    },
  });
  return success(
    memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      role: m.role,
      createdAt: m.workspace.createdAt,
    })),
    200,
  );
}
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return failure("UNAUTHORIZED", "User not logged in", 401);
  }
  const body = await req.json();
  const parsed = workspaceSchema.safeParse(body);
  if (!parsed.success) {
    return failure("INVALID_DATA", "Invalid workspace data", 400);
  }
  const workspace = await prisma.workspace.create({
    data: {
      name: parsed.data.name.trim(),
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "owner",
        },
      },
    },
  });
  return success(
    {
      id: workspace.id,
      name: workspace.name,
      role: "owner",
      createdAt: workspace.createdAt,
    },
    201,
  );
}
