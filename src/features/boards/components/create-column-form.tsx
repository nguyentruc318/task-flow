"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateColumn } from "../hooks/useColumn";
import { useForm } from "react-hook-form";
import { CreateColumnInput, createColumnSchema } from "../schema/column.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateColumnInline({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);

  const { createColumnForm, isLoading } = useCreateColumn(boardId);
  const { handleSubmit, reset, register } = useForm<CreateColumnInput>({
    defaultValues: {
      boardId: boardId,
      name: "",
    },
    resolver: zodResolver(createColumnSchema),
  });

  if (!open) {
    return (
      <Button
        variant="outline"
        className="h-fit w-72 shrink-0 justify-start"
        onClick={() => setOpen(true)}
      >
        + Add column
      </Button>
    );
  }

  return (
    <div className="w-72 shrink-0 space-y-2 rounded-lg border bg-muted/40 p-3">
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
          createColumnForm(data);
          reset();
        })}
      >
        <Input autoFocus placeholder="Column name" {...register("name")} />
        <div className="flex gap-2">
          <Button size="sm" type="submit" disabled={isLoading}>
            Add
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
