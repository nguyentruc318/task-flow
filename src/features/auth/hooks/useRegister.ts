"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import authApiRequest from "../services/auth.service";
import { RegisterSchema } from "../schemas/auth.schema";

export function useRegister() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (body: RegisterSchema) => authApiRequest.register(body),

    onSuccess: () => {
      // sau register → chuyển sang login
      router.push("/login");
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
