"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
// import { TaskCard, type Task } from "./task-card"
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
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
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  useUpdateTask,
  useBulkUpdateTaskPositions,
} from "@/services/api/taskManagement/taskApi";
import { cn } from "@/lib/utils";

interface BoardColumnProps {
  column: ITaskColumnBase;
  invitedTasks?: ITask[];
  disableEditDelete?: boolean;
  disableDnD?: boolean;
}

export function BoardColumn({ column, invitedTasks, disableEditDelete, disableDnD }: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column._id,
  });

  const queryClient = useQueryClient();

  const [showAddCard, setShowAddCard] = useState(false);
  const [showEditColumnDialogOpen, setShowEditColumnDialogOpen] =
    useState(false);
  const [showDeleteColumnDialogOpen, setShowDeleteColumnDialogOpen] =
    useState(false);

  // Always call the hook, but ignore its result if invitedTasks is provided
  const { data: tasksData, isLoading: isTasksLoading } = useGetTaskByColumn(column._id);
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const { mutate: updateColumn, isPending: isUpdatingColumn } =
    useUpdateColumn();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: bulkUpdateTaskPositions } = useBulkUpdateTaskPositions();

  // Local state for task order
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (invitedTasks) {
      setTasks(invitedTasks);
    } else if (tasksData?.data) {
      // Sort by position field if present
      setTasks(
        [...tasksData.data].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0),
        ),
      );
    }
  }, [invitedTasks, tasksData]);

  // Drag and drop handler for within-column reordering
  const handleDragEnd = (event: DragEndEvent) => {
    if (disableDnD) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex((t) => t._id === active.id);
    const newIndex = tasks.findIndex((t) => t._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    // Update positions
    newTasks.forEach((task, idx) => {
      task.position = idx;
    });
    setTasks(newTasks);
    // Persist changes in bulk
    bulkUpdateTaskPositions(
      newTasks.map((task) => ({ _id: task._id, position: task.position })),
    );
  };

  const handleAddTask = (title: string) => {
    if (isCreatingTask) return;

    createTask(
      { title, column: column._id },
      {
        onSuccess: (data) => {
          const newTask = data?.data;
          console.log("Task created successfully:", newTask);
          setShowAddCard(false);

          const queryKey = ["tasks", column._id];

          // Get current cache
          const existing = queryClient.getQueryData<{ data: ITask[] }>(
            queryKey,
          );
          const previousTasks = existing?.data || [];

          // Update cache manually
          queryClient.setQueryData(queryKey, {
            data: [...previousTasks, newTask],
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
          queryClient.invalidateQueries({ queryKey: ["columns"] });
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

  return (
    <>
      <Card className="h-fit w-80 flex-shrink-0 gap-0 rounded-lg border border-gray-200 bg-gray-50 p-0 px-0 shadow-sm">
        <CardHeader className="rounded-t-lg border-b border-gray-100 bg-white p-4 px-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <CardTitle className="text-sm font-semibold text-gray-800">
                {column.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {tasks.length}
              </span>
              {!disableEditDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 rounded-full p-0 transition-colors hover:bg-gray-100"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 border border-gray-200 bg-white shadow-lg"
                  >
                    <DropdownMenuItem
                      onClick={() => setShowEditColumnDialogOpen(true)}
                      className="flex cursor-pointer items-center gap-2 text-sm hover:bg-gray-50"
                    >
                      <Edit3 className="h-4 w-4 text-gray-500" />
                      Edit column
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteColumnDialogOpen(true)}
                      className="flex cursor-pointer items-center gap-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete column
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className={cn("max-h-[calc(100vh-340px)] overflow-y-auto bg-gray-50 px-4 pr-3 pb-1 pt-3 minimal-scroll", disableDnD && "pb-4")}>
          {!disableDnD ? (
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={tasks.map((task) => task?._id)}
                strategy={verticalListSortingStrategy}
              >
                <div ref={setNodeRef} className="min-h-[1px] space-y-3">
                  {tasks
                    .filter((task) => !task?.isArchived)
                    .map((task) => (
                      <TaskCard key={task?._id} task={task} disableDnD={disableDnD} disableEditDelete={disableEditDelete} />
                    ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="min-h-[1px] space-y-3">
              {tasks
                .filter((task) => !task?.isArchived)
                .map((task) => (
                  <TaskCard key={task?._id} task={task} disableDnD={disableDnD} disableEditDelete={disableEditDelete} />
                ))}
            </div>
          )}
        </CardContent>
        {!disableEditDelete && (
          <CardFooter className="px-4  pb-2">
            {showAddCard ? (
              <AddCardInput
                onAdd={handleAddTask}
                onCancel={() => setShowAddCard(false)}
              />
            ) : (
              <Button
                variant="ghost"
                className="mt-3 w-full justify-start rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-gray-500 transition-all duration-200 hover:border-gray-400 hover:bg-white hover:text-gray-700"
                onClick={() => setShowAddCard(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add a card
              </Button>
            )}
          </CardFooter>
        )}

        {!disableEditDelete && (
          <EditColumnDialog
            column={column}
            isOpen={showEditColumnDialogOpen}
            onClose={() => setShowEditColumnDialogOpen(false)}
            onSave={handleSaveColumn}
          />
        )}
        {!disableEditDelete && (
          <DeleteColumnDialog
            columnId={column?._id}
            columnTitle={column?.title}
            showDialog={showDeleteColumnDialogOpen}
            setShowDialog={setShowDeleteColumnDialogOpen}
          />
        )}
      </Card>
    </>
  );
}
