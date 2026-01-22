import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import authApiRequest from "../services/auth.service";
import { LoginSchema } from "../schemas/auth.schema";

export function useLogin() {
  const router = useRouter();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (body: LoginSchema) => authApiRequest.login(body),
    onSuccess: () => {
      router.push("/boards");
    },
    retry: false,
  });
  return {
    login: mutate,
    isLoading: isPending,
    error,
  };
}
