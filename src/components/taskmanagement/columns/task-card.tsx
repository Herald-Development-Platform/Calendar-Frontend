"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit2, Archive, CheckSquare, GripVertical } from "lucide-react";
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
  disableDnD?: boolean;
  disableEditDelete?: boolean;
}

export function TaskCard({ task, disableDnD, disableEditDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task?._id,
  });

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
        completed: task?.checklist.filter(item => item.isCompleted).length,
        total: task?.checklist.length,
      }
    : null;

  // Function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const onToggleComplete = (taskId: string) => {
    const columnId = task?.column?._id;
    const queryKey = ["tasks", columnId];

    // Get current cached tasks
    const columnTasks: { data: ITask[] } | undefined = queryClient.getQueryData(queryKey);
    const previousTasks = columnTasks?.data;

    // Create updated task
    const updatedTask = { ...task, isCompleted: !task?.isCompleted };

    // Create optimistic update
    const updatedTasks = previousTasks?.map((t: ITask) => {
      if (t._id === taskId) {
        return updatedTask;
      }
      return t;
    });

    // Optimistically update the cache
    queryClient.setQueryData(queryKey, {
      data: updatedTasks,
    });

    // Call the API
    updateTask(updatedTask, {
      onSuccess: () => {
        // Optional: Refetch or leave as is if optimistic update matches server
      },
      onError: error => {
        console.error("Error updating task:", error);

        // Roll back to previous tasks
        queryClient.setQueryData(queryKey, {
          data: previousTasks,
        });
      },
    });
  };

  const onToggleArchive = (taskId: string) => {
    const columnId = task?.column?._id;
    const queryKey = ["tasks", columnId];
    const archivedKey = ["archived-tasks"];

    const updatedTask = { ...task, isArchived: !task?.isArchived };

    // Get previous tasks and archived-tasks from cache
    const columnTasks: { data: ITask[] } | undefined = queryClient.getQueryData(queryKey);
    const archivedTasks: { data: ITask[] } | undefined = queryClient.getQueryData(archivedKey);

    const previousColumnTasks = columnTasks?.data || [];
    const previousArchivedTasks = archivedTasks?.data || [];

    // Optimistically update "tasks" list
    const updatedColumnTasks = updatedTask.isArchived
      ? previousColumnTasks.filter(t => t._id !== taskId)
      : [...previousColumnTasks, updatedTask]; // In case of unarchive

    queryClient.setQueryData(queryKey, {
      data: updatedColumnTasks,
    });

    // Optimistically update "archived-tasks" list
    const updatedArchivedTasks = updatedTask.isArchived
      ? [...previousArchivedTasks, updatedTask]
      : previousArchivedTasks.filter(t => t._id !== taskId);

    queryClient.setQueryData(archivedKey, {
      data: updatedArchivedTasks,
    });

    // Perform API call
    updateTask(updatedTask, {
      onSuccess: () => {
        // Optional: refetch or assume cache is correct
      },
      onError: error => {
        console.error("Error updating task:", error);

        // Roll back both caches
        queryClient.setQueryData(queryKey, {
          data: previousColumnTasks,
        });

        queryClient.setQueryData(archivedKey, {
          data: previousArchivedTasks,
        });
      },
    });
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`group cursor-pointer  rounded-lg py-0 shadow-sm transition-shadow hover:border-black/40 hover:shadow-sm ${
          isDragging ? "opacity-50 " : ""
        } ${task?.isCompleted ? "bg-gray-50 opacity-60" : ""}`}
        onClick={() => setOpenTaskDialog(true)}
      >
        <CardContent className="relative flex flex-row items-start gap-2 p-3">
          {/* Drag Handle */}
          {!disableDnD && (
            <span
              {...attributes}
              {...listeners}
              className="mt-1 flex w-full  max-w-0 cursor-grab select-none items-center transition-all duration-300 active:cursor-grabbing group-hover:max-w-4"
              onClick={e => e.stopPropagation()} // Prevent opening dialog when clicking handle
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </span>
          )}
          <div className="flex-1">
            <h3
              className={`mb-2 text-sm font-medium ${task?.isCompleted ? "text-gray-500 line-through" : ""}`}
            >
              {task?.title}
            </h3>
            {task?.description && (
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
                {task?.createdBy && (
                  <div
                    className="flex items-center gap-1"
                    title={`Created by ${task.createdBy.username}`}
                  >
                    <UserAvatar user={task.createdBy} size="sm" showPopover />
                  </div>
                )}
              </div>
            </div>

            {/* Hover Actions */}
            {!disableEditDelete && (
              <div
                className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                onMouseDown={e => e.stopPropagation()} // Prevent drag when clicking buttons
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 cursor-pointer bg-white p-0 shadow-sm hover:bg-gray-50"
                  onClick={e => {
                    e.stopPropagation();
                    onToggleComplete(task?._id);
                  }}
                  onMouseDown={e => e.stopPropagation()}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      task?.isCompleted ? "border-green-500 bg-green-500" : "border-gray-400"
                    }`}
                  >
                    {task?.isCompleted && <div className="text-xs leading-none text-white">✓</div>}
                  </div>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 cursor-pointer bg-white p-0 shadow-sm hover:bg-gray-50"
                  onClick={e => {
                    e.stopPropagation();
                    setOpenTaskDialog(true);
                  }}
                  onMouseDown={e => e.stopPropagation()}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 cursor-pointer bg-white p-0 shadow-sm hover:bg-gray-50"
                  onClick={e => {
                    e.stopPropagation();
                    onToggleArchive(task?._id);
                  }}
                  onMouseDown={e => e.stopPropagation()}
                >
                  <Archive className="h-3 w-3" />
                </Button>
              </div>
            )}
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
