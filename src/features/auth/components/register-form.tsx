"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterSchema,
} from "@/features/auth/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { useRegister } from "../hooks/useRegister";

export default function RegisterForm() {
  //   const { login, isLoading, error } = useLogin();
  const { register: submitRegister, isLoading } = useRegister();

  const {handleSubmit,register} = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <>
      {" "}
      <form
        onSubmit={handleSubmit((data) => submitRegister(data))}
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
          </div>
          <Input id="password" type="password" {...register("password")} />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
          </div>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
          />
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </>
  );
}
