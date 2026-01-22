import { registerSchema } from "@/features/auth/schemas/auth.schema";
import { createClient } from "@/lib/supabase-client";
import { failure, success } from "@/types/api.response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return failure("INVALID_JSON", "Invalid request body", 400);
  }

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return failure("INVALID_INPUT", "Validation failed", 422);
  }

  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return failure("REGISTER_FAILED", error.message, 400);
  }
  return success(
    {
      message: "Register successful",
    },
    201,
  );
}
