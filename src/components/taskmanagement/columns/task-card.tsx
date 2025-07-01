"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit2, Archive, CheckSquare } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "../user-avatar";
import { ITask } from "@/types/taskmanagement/task.types";
import { TaskDialog } from "../task/task-dialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateTask } from "@/services/api/taskManagement/taskApi";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  assignee?: User;
  checklist?: ChecklistItem[];
  archived?: boolean;
  completed?: boolean;
  createdBy?: User;
  comments?: Comment[];
  createdAt?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
}

interface TaskCardProps {
  task: ITask;
  // onEdit: (task: Task) => void
  // onArchive: (taskId: string) => void
  // onToggleComplete: (taskId: string) => void
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task?._id });

  const queryClient = useQueryClient();

  // API CALLS
  const { mutate: updateTask, isPending } = useUpdateTask();

  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    let colorClass = "text-muted-foreground";
    if (task?.isCompleted) {
      colorClass = "text-green-600";
    } else if (diffDays < 0) {
      colorClass = "text-red-600";
    } else if (diffDays <= 2) {
      colorClass = "text-orange-600";
    }

    return { formatted, colorClass };
  };

  const checklistProgress = task?.checklist
    ? {
        completed: task?.checklist.filter((item) => item.completed).length,
        total: task?.checklist.length,
      }
    : null;

  // Function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const onToggleComplete = (taskId: string) => {
    const updatedTask = { ...task, isCompleted: !task?.isCompleted };

    updateTask(updatedTask, {
      onSuccess: () => {
        const columnTasks: { data: ITask[] } | undefined =
          queryClient.getQueryData(["tasks", task?.column?._id]);

        const updatedTasks = columnTasks?.data?.map((t: ITask) => {
          if (t._id === taskId) {
            return updatedTask;
          }
          return t;
        });

        queryClient.setQueryData(["tasks", task?.column?._id], {
          data: updatedTasks,
        });
      },
      onError: (error) => {
        console.error("Error updating task:", error);
      },
    });
  };

  const onToggleArchive = (taskId: string) => {
    const updatedTask = { ...task, isArchived: !task?.isArchived };

    updateTask(updatedTask, {
      onSuccess: () => {
        const columnTasks: { data: ITask[] } | undefined =
          queryClient.getQueryData(["tasks", task?.column?._id]);

        const updatedTasks = columnTasks?.data?.map((t: ITask) => {
          if (t._id !== taskId) {
            return t;
          }
        });

        queryClient.setQueryData(["tasks", task?.column?._id], {
          data: updatedTasks,
        });

        // Update archived tasks
        const archivedTasks: { data: ITask[] } | undefined =
          queryClient.getQueryData(["archived-tasks"]);

        if (updatedTask.isArchived) {
          // Add to archived tasks
          queryClient.setQueryData(["archived-tasks"], {
            data: [...(archivedTasks?.data || []), updatedTask],
          });
        }
      },
      onError: (error) => {
        console.error("Error updating task:", error);
      },
    });
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group cursor-grab rounded py-0 transition-shadow hover:border-black hover:shadow-sm active:cursor-grabbing ${isDragging ? "opacity-50" : ""} ${
          task?.isCompleted ? "bg-gray-50 opacity-60" : ""
        }`}
        onClick={() => setOpenTaskDialog(true)}
      >
        <CardContent className="relative p-3">
          <h3
            className={`mb-2 text-sm font-medium ${task?.isCompleted ? "text-gray-500 line-through" : ""}`}
          >
            {task?.title}
          </h3>
          {task.description && (
            <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
              {stripHtml(task?.description)}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {task?.priority && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${priorityColors[task?.priority]}`}
                >
                  {task?.priority}
                </Badge>
              )}
              {checklistProgress && checklistProgress.total > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckSquare className="h-3 w-3" />
                  <span
                    className={
                      checklistProgress?.completed === checklistProgress?.total
                        ? "text-green-600"
                        : ""
                    }
                  >
                    {checklistProgress?.completed}/{checklistProgress?.total}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              {task?.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className={formatDate(task?.dueDate).colorClass}>
                    {formatDate(task?.dueDate).formatted}
                  </span>
                </div>
              )}
              {task?.assignee && (
                <UserAvatar user={task?.assignee} size="sm" showPopover />
              )}
            </div>
          </div>

          {/* Hover Actions */}
          <div
            className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
            onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking buttons
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 cursor-pointer bg-white p-0 shadow-sm hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task?._id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  task?.isCompleted
                    ? "border-green-500 bg-green-500"
                    : "border-gray-400"
                }`}
              >
                {task?.isCompleted && (
                  <div className="text-xs leading-none text-white">✓</div>
                )}
              </div>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 cursor-pointer bg-white p-0 shadow-sm hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                setOpenTaskDialog(true);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 cursor-pointer bg-white p-0 shadow-sm hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onToggleArchive(task?._id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Archive className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <TaskDialog
        task={task}
        openTaskDialog={openTaskDialog}
        setOpenTaskDialog={setOpenTaskDialog}
      />
    </>
  );
}
