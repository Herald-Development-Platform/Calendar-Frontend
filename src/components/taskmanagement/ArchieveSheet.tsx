import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ITask } from "@/types/taskmanagement/task.types";
import {
  Archive,
  Calendar,
  RotateCcw,
  Trash2,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { UserAvatar } from "./user-avatar";
import {
  useDeleteTask,
  useGetArchivedTasks,
  useUpdateTask,
} from "@/services/api/taskManagement/taskApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface ArchivedTasksSheetProps {
  children: React.ReactNode;
}

const priorityColors = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const priorityIcons = {
  low: "🟢",
  medium: "🟡",
  high: "🔴",
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const ArchieveSheet = () => {
  const { data: archivedTasks } = useGetArchivedTasks();
  const queryClient = useQueryClient();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  const filteredTasks = archivedTasks?.data?.filter((task: ITask) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !filterPriority || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const handleRestore = (task: ITask) => {
    setIsRestoring(task._id);
    const updatedTask = {
      ...task,
      isArchived: false,
    };

    updateTask(updatedTask, {
      onSuccess: () => {
        const updatedTasks = archivedTasks?.data?.filter((t: ITask) => t._id !== task._id);
        queryClient.setQueryData(["archived-tasks"], { data: updatedTasks });
        const columnTasks: { data: ITask[] } | undefined = queryClient.getQueryData([
          "tasks",
          task.column._id,
        ]);
        const updatedColumnTasks = [...(columnTasks?.data ?? []), updatedTask];

        queryClient.setQueryData(["tasks", task.column._id], {
          data: updatedColumnTasks,
        });
        setIsRestoring(null);
      },
      onError: () => {
        setIsRestoring(null);
      },
    });
  };

  const handleDelete = (taskId: string) => {
    if (isDeleting) return;
    deleteTask(taskId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["archived-tasks"],
        });
        // queryClient.setQueryData(["archived-tasks"], (oldData: any) => {
        //   if (!oldData?.data) return oldData;

        //   return {
        //     ...oldData,
        //     data: oldData.data.filter((task: ITask) => task._id !== taskId),
        //   };
        // });
      },
      onError: error => {
        console.error("Failed to delete task:", error);
      },
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterPriority("");
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="relative font-normal">
            <Archive className="mr-2 h-5 w-5" />
            Archived
            {archivedTasks?.data?.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-[20px] px-1 text-xs">
                {archivedTasks.data.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="flex w-[360px] flex-col sm:w-[420px]">
          <SheetHeader className="pb-3">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
                <Archive className="h-3 w-3 text-slate-600" />
              </div>
              <div>
                <div className="text-base font-semibold">Archived Tasks</div>
                <div className="text-xs font-normal text-muted-foreground">
                  {archivedTasks?.data?.length || 0} tasks
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Search and Filter Section */}
          <div className="space-y-2 border-b pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Filter className="mr-1.5 h-3 w-3" />
                    Priority
                    {filterPriority && (
                      <Badge variant="secondary" className="ml-1.5 h-3 px-1 text-xs">
                        {filterPriority}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterPriority("")}>
                    All priorities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority("high")}>
                    🔴 High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority("medium")}>
                    🟡 Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority("low")}>
                    🟢 Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {(searchTerm || filterPriority) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Tasks List */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2 py-3">
              {!filteredTasks?.length ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Archive className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900">
                    {searchTerm || filterPriority ? "No matching tasks" : "No archived tasks"}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {searchTerm || filterPriority
                      ? "Try adjusting your search or filters"
                      : "Tasks you archive will appear here"}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task: ITask) => (
                  <Card
                    key={task._id}
                    className="group relative overflow-hidden border-slate-200/60 transition-all duration-200 hover:bg-slate-50"
                  >
                    <CardContent className="p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`mb-1 text-sm font-medium leading-5 ${
                              task.isCompleted ? "text-slate-500 line-through" : "text-slate-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="line-clamp-2 text-xs leading-4 text-slate-600">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRestore(task)}
                              disabled={isRestoring === task._id}
                              className="text-blue-600"
                            >
                              <RotateCcw className="mr-2 h-3 w-3" />
                              {isRestoring === task._id ? "Restoring..." : "Restore"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setTaskToDelete(task._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-3 w-3" />
                              Delete permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {task.priority && (
                            <Badge
                              variant="outline"
                              className={`h-5 px-2 text-xs font-medium ${priorityColors[task.priority]}`}
                            >
                              {priorityIcons[task.priority]} {task.priority}
                            </Badge>
                          )}
                          {task.isCompleted && (
                            <Badge
                              variant="outline"
                              className="h-5 border-emerald-200 bg-emerald-50 px-2 text-xs text-emerald-700"
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Completed
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(task.dueDate)}</span>
                            </div>
                          )}
                          {/* {task.assignee && (
                            <div className="flex items-center gap-1">
                              <UserAvatar user={task.assignee} size="sm" />
                            </div>
                          )} */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Task Permanently
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task will be permanently deleted from your archive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => taskToDelete && handleDelete(taskToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ArchieveSheet;
