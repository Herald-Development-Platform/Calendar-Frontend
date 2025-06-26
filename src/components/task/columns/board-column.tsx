"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
// import { TaskCard, type Task } from "./task-card"
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddCardInput } from "./add-card-input";
import { ITaskColumnBase } from "@/types/taskmanagement/column.types";
import { TaskCard } from "./task-card";
import { ITask } from "@/types/taskmanagement/task.types";
import {
  useCreateTask,
  useGetTaskByColumn,
} from "@/services/api/taskManagement/taskApi";
import toast from "react-hot-toast";
import { EditColumnDialog } from "./edit-column-dialog";
import {
  useDeleteColumn,
  useUpdateColumn,
} from "@/services/api/taskManagement/columnsApi";
import { useQueryClient } from "@tanstack/react-query";
import DeleteColumnDialog from "./delete-column-dialog";

interface BoardColumnProps {
  column: ITaskColumnBase;
  // onAddTask: (columnId: string, title: string) => void
  // onEditTask: (task: Task) => void
  // onArchiveTask: (taskId: string) => void
  // onToggleComplete: (taskId: string) => void
  // onEditColumn: (columnId: string) => void
  // onDeleteColumn: (columnId: string) => void
}

export function BoardColumn({
  column,
  // onAddTask,
  // onEditTask,
  // onArchiveTask,
  // onToggleComplete,
  // onEditColumn,
  // onDeleteColumn,
}: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column._id,
  });

  const queryClient = useQueryClient();

  const [showAddCard, setShowAddCard] = useState(false);
  const [showEditColumnDialogOpen, setShowEditColumnDialogOpen] =
    useState(false);
  const [showDeleteColumnDialogOpen, setShowDeleteColumnDialogOpen] =
    useState(false);

  // API CALLS
  const { data: tasksData, isLoading: isTasksLoading } = useGetTaskByColumn(
    column._id,
  );
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const { mutate: updateColumn, isPending: isUpdatingColumn } =
    useUpdateColumn();

  console.log(column.title, tasksData);

  const handleAddTask = (title: string) => {
    if (isCreatingTask) return;
    createTask(
      { title, column: column._id },
      {
        onSuccess: () => {
          setShowAddCard(false);
          queryClient.invalidateQueries({
            queryKey: ["tasks", column._id],
          });
        },
        onError: (error) => {
          toast.error(
            (error as any)?.response?.data?.message || "Failed to create task",
          );
        },
      },
    );
  };

  const handleSaveColumn = (columnId: string, title: string) => {
    if (isUpdatingColumn) return;
    updateColumn(
      { columnId, title },
      {
        onSuccess: () => {
          setShowEditColumnDialogOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["columns"],
          });
        },
        onError: (error) => {
          toast.error(
            (error as any)?.response?.data?.message ||
              "Failed to update column",
          );
        },
      },
    );
  };

  const tasks: any = [];

  return (
    <>
      <Card className="h-fit w-80 flex-shrink-0 gap-0 rounded border p-0 px-0 shadow">
        <CardHeader className="p-4 px-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {column.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                {tasksData?.data?.length}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowEditColumnDialogOpen(true)}
                  >
                    Edit column
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteColumnDialogOpen(true)}
                    className="text-red-600"
                  >
                    Delete column
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4  pt-0">
          {!isTasksLoading && (
            <div ref={setNodeRef} className="min-h-[1px] space-y-2">
              <SortableContext
                items={tasksData?.data?.map((task: ITask) => task?._id)}
                strategy={verticalListSortingStrategy}
              >
                {tasksData?.data
                  ?.filter((task: ITask) => !task.archived)
                  .map((task: ITask) => (
                    <TaskCard
                      key={task?._id}
                      task={task}
                      // onEdit={onEditTask}
                      // onArchive={onArchiveTask}
                      // onToggleComplete={onToggleComplete}
                    />
                  ))}
              </SortableContext>
            </div>
          )}
          {showAddCard ? (
            <AddCardInput
              onAdd={handleAddTask}
              onCancel={() => setShowAddCard(false)}
            />
          ) : (
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start px-4 text-muted-foreground hover:text-foreground"
              onClick={() => setShowAddCard(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add a card
            </Button>
          )}
        </CardContent>
      </Card>

      <EditColumnDialog
        column={column}
        isOpen={showEditColumnDialogOpen}
        onClose={() => setShowEditColumnDialogOpen(false)}
        onSave={handleSaveColumn}
      />
      <DeleteColumnDialog
        columnId={column?._id}
        columnTitle={column?.title}
        showDialog={showDeleteColumnDialogOpen}
        setShowDialog={setShowDeleteColumnDialogOpen}
      />
    </>
  );
}
