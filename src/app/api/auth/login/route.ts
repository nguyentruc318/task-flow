import { createClient } from "@/lib/supabase-client";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { NextResponse } from "next/server";
import { failure, success } from "@/types/api.response";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error, data } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
      return failure("AUTH_ERROR", error.message, 401);
    }

    return success(data);
  } catch (error) {
    return failure(
      "INTERNAL_SERVER_ERROR",
      "Internal server error",
      500
    );
  }
}
