"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/features/auth/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { useLogin } from "../hooks/useLogin";
export default function LoginForm() {
  const { login, isLoading, error } = useLogin();
  const { handleSubmit, register } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      {" "}
      <form
        onSubmit={handleSubmit((data) => login(data))}
        className="flex flex-col gap-6"
      >
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </button>
          </div>
          <Input id="password" type="password" {...register("password")} />
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </>
  );
}
