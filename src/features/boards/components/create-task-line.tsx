// CreateTaskInline.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CreateTaskInput, createTaskSchema } from "../schema/task.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskColumn } from "../hooks/useTask";

export default function CreateTaskInline({
  columnId,
  boardId,
}: {
  columnId: string;
  boardId: string;
}) {
  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
    setValue,
  } = useForm<CreateTaskInput>({
    defaultValues: {
      columnId,
      priority: "medium",
      description: "",
      title: "",
    },
    resolver: zodResolver(createTaskSchema),
  });
  const { createTask, isLoading } = useTaskColumn(boardId);
  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 justify-start"
        onClick={() => setOpen(true)}
      >
        + Add task
      </Button>
    );
  }
  console.log(errors);
  return (
    <div className="mt-2 space-y-2">
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
          createTask(data);
          reset();
          setOpen(false);
        })}
        className="space-y-4"
      >
        {/* Hidden columnId */}
        <input type="hidden" {...register("columnId")} />

        {/* Title */}
        <div className="space-y-1">
          <Label>Title</Label>
          <Input
            placeholder="Task title"
            {...register("title", { required: true })}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea
            placeholder="Task description"
            rows={3}
            {...register("description")}
          />
        </div>

        {/* Priority */}
        <div className="space-y-1">
          <Label>Priority</Label>
          <Select
            defaultValue="medium"
            onValueChange={(v) =>
              setValue("priority", v as "low" | "medium" | "high")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start date */}
        <div className="space-y-1">
          <Label>Start date</Label>
          <Input
            type="datetime-local"
            {...register("startDate", {
              setValueAs: (value) =>
                value ? new Date(value).toISOString() : undefined,
            })}
          />
        </div>

        {/* Due date */}
        <div className="space-y-1">
          <Label>Due date</Label>
          <Input
            type="datetime-local"
            {...register("dueDate", {
              setValueAs: (value) =>
                value ? new Date(value).toISOString() : undefined,
            })}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create task"}
        </Button>
      </form>
    </div>
  );
}
