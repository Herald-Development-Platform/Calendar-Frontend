import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ITask } from "@/types/taskmanagement/task.types";
import { Archive, RotateCcw, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { UserAvatar } from "./user-avatar";
import {
  useDeleteTask,
  useGetArchivedTasks,
  useUpdateTask,
} from "@/services/api/taskManagement/taskApi";
import { useQueryClient } from "@tanstack/react-query";

interface ArchivedTasksSheetProps {
  children: React.ReactNode;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const ArchieveSheet = () => {
  const { data: archivedTasks } = useGetArchivedTasks();
  const queryClient = useQueryClient();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const handleRestore = (task: ITask) => {
    const updatedTask = {
      ...task,
      isArchived: false,
    };

    updateTask(updatedTask, {
      onSuccess: () => {
        const updatedTasks = archivedTasks?.data?.filter(
          (t: ITask) => t._id !== task._id,
        );
        queryClient.setQueryData(["archived-tasks"], { data: updatedTasks });
        const columnTasks: { data: ITask[] } | undefined =
          queryClient.getQueryData(["tasks", task.column._id]);
        const updatedColumnTasks = [...(columnTasks?.data ?? []), updatedTask];

        queryClient.setQueryData(["tasks", task.column._id], {
          data: updatedColumnTasks,
        });
      },
    });
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId, {
      onSuccess: () => {
        const updatedTasks = archivedTasks?.data?.filter(
          (task: ITask) => task._id !== taskId,
        );
        queryClient.setQueryData(["archived-tasks"], { data: updatedTasks });
      },
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Archive className="mr-2 h-4 w-4" />
          Archived ({archivedTasks?.data?.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Tasks ({archivedTasks?.data?.length})
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 max-h-[calc(100vh-120px)] space-y-4 overflow-y-auto">
          {archivedTasks?.data?.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Archive className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No archived tasks</p>
            </div>
          ) : (
            archivedTasks?.data?.map((task: ITask) => (
              <Card
                key={task._id}
                className="group cursor-pointer hover:shadow-sm"
                // onClick={() => onEdit(task)}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3
                      className={`text-sm font-medium ${task.isCompleted ? "text-gray-500 line-through" : ""}`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(task);
                        }}
                        title="Restore task"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task._id);
                        }}
                        title="Delete permanently"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {task.description && (
                    <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {task.priority && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${priorityColors[task.priority]}`}
                        >
                          {task.priority}
                        </Badge>
                      )}
                      {task.isCompleted && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-xs text-green-800"
                        >
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <UserAvatar user={task.assignee} size="sm" />
                          <span className="ml-1">{task.assignee.username}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ArchieveSheet;
