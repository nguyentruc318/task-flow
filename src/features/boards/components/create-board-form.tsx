// features/boards/components/CreateBoardDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBoardSchema, CreateBoardSchema } from "../schema/board.schema";
import { useCreateBoard } from "../hooks/useBoard";

export function CreateBoardDialog() {
  const { createBoard, isLoading, error } = useCreateBoard();
  const form = useForm<CreateBoardSchema>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { name: "" },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create board</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new board</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((data) => {
            createBoard({ ...data });
            form.reset();
          })}
        >
          <div>
            <Label htmlFor="name">Board name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            Create board
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
