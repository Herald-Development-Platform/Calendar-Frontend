"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Flag } from "lucide-react";
import { useCreateTask } from "@/services/api/taskManagement/taskApi";
import { useGetColumns } from "@/services/api/taskManagement/columnsApi";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  column: string;
}

const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function AddTaskDialog({ open, onOpenChange, selectedDate }: AddTaskDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const { data: columnsData } = useGetColumns();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      column: "",
    },
  });

  // Set default due date when dialog opens with a selected date
  useEffect(() => {
    if (open && selectedDate) {
      // Set the due date to the selected date at end of day, but ensure it's still the same day
      const dueDate = new Date(selectedDate);
      dueDate.setHours(23, 59, 59, 999); // Set to very end of the day
      setValue("dueDate", formatDateTimeLocal(dueDate));
    }
  }, [open, selectedDate, setValue]);

  // Reset form when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      // Set the due date to the selected date at end of day, but ensure it's still the same day
      const dueDate = new Date(selectedDate);
      dueDate.setHours(23, 59, 59, 999); // Set to very end of the day
      setValue("dueDate", formatDateTimeLocal(dueDate));
    }
  }, [selectedDate, setValue]);

  // Set default column when columns are loaded
  useEffect(() => {
    if (columnsData?.data && columnsData.data.length > 0) {
      setValue("column", columnsData.data[0]._id);
    }
  }, [columnsData, setValue]);

  const onSubmit = (data: TaskFormData) => {
    if (!data.column) {
      toast.error("Please select a column");
      return;
    }

    const taskData = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      column: data.column,
    };

    createTask(taskData as any, {
      onSuccess: (response) => {
        toast.success("Task created successfully!");
        
        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({ queryKey: ["tasks", data.column] });
        
        // Reset form and close dialog
        reset();
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to create task");
      },
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Add New Task
            {selectedDate && (
              <span className="text-sm font-normal text-gray-500">
                for {selectedDate.toLocaleDateString()}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Enter task title..."
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Enter task description..."
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        High
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Due Date & Time
            </label>
            <Input
              {...register("dueDate")}
              type="datetime-local"
              className="w-full"
            />
          </div>

          {/* Column Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Column *</label>
            <Controller
              name="column"
              control={control}
              rules={{ required: "Please select a column" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.column ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columnsData?.data?.map((column: any) => (
                      <SelectItem key={column._id} value={column._id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.column && (
              <p className="text-sm text-red-500">{errors.column.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreatingTask}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingTask}>
              {isCreatingTask ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}