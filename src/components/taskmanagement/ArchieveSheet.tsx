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
  CheckSquare,
  Check,
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
import { cn } from "@/lib/utils";

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
                <DropdownMenuContent className="w-48 p-1">
                  <DropdownMenuItem 
                    onClick={() => setFilterPriority("")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                      <Filter className="h-3 w-3 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">All priorities</span>
                  </DropdownMenuItem>
                  
                  <div className="my-1 h-px bg-slate-200" />
                  
                  <DropdownMenuItem 
                    onClick={() => setFilterPriority("high")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-red-50 focus:bg-red-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">High Priority</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setFilterPriority("medium")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-orange-50 focus:bg-orange-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Medium Priority</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setFilterPriority("low")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-green-50 focus:bg-green-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Low Priority</span>
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
                    className="group cursor-pointer rounded-lg bg-[#fcfcfd] py-1 pb-1.5 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)] transition-shadow hover:border-black/40 hover:shadow-sm"
                  >
                    <CardContent className="relative flex flex-row items-start gap-2 p-0">
                      <div className="ml-2 flex-1 space-y-1.5">
                        {task?.priority !== "low" && task?.priority && (
                          <Badge
                            variant="secondary"
                            className={`rounded-sm px-1 py-0 text-[10px] font-light capitalize text-white hover:${
                              task.priority === "medium"
                                ? "bg-[#ed9200]"
                                : task.priority === "high"
                                  ? "bg-[#ae2e24]"
                                  : "bg-green-500"
                            } ${
                              task.priority === "medium"
                                ? "bg-[#ed9200]"
                                : task.priority === "high"
                                  ? "bg-[#ae2e24]"
                                  : "bg-green-500"
                            }`}
                          >
                            {task.priority} Priority
                          </Badge>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            className={cn(
                              "flex h-4 w-4 cursor-pointer items-center justify-center rounded bg-white p-0.5 text-white",
                              task?.isCompleted ? "bg-theme" : "border border-[#7e7e7f]"
                            )}
                            onClick={e => {
                              e.stopPropagation();
                            }}
                            onMouseDown={e => e.stopPropagation()}
                          >
                            {task?.isCompleted && <Check />}
                          </button>
                          <h3
                            className={`text-[13px] font-medium text-black/70 ${
                              task?.isCompleted ? "text-gray-500 line-through" : ""
                            }`}
                          >
                            {task?.title}
                          </h3>
                        </div>

                        {task?.description && (
                          <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
                            {task?.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pr-1.5">
                          <div className="flex items-center gap-1">
                            {task?.checklist && task.checklist.length > 0 && (
                              <div className="flex items-center gap-1 rounded-sm bg-theme px-1 py-0.5 text-[11px] font-light text-white">
                                <CheckSquare className="h-3 w-3" />
                                <span>
                                  {task.checklist.filter(item => item.isCompleted).length}/
                                  {task.checklist.length}
                                </span>
                              </div>
                            )}
                            {task?.dueDate && (
                              <div className="flex items-center gap-1 rounded-sm bg-theme px-1 py-0.5 text-[11px] font-light text-white">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(task?.dueDate)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
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
                        <div className="absolute right-2 top-0 flex gap-0 opacity-0 transition-opacity group-hover:opacity-100">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 cursor-pointer bg-white p-0"
                                onClick={e => e.stopPropagation()}
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
