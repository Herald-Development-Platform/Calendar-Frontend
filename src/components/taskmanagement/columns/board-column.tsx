"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Edit3, Trash2, GripVertical } from "lucide-react";
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

// Minimalist design - single neutral color scheme

const columnColors = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", accent: "bg-blue-100" },
  green: { bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500", accent: "bg-green-100" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-500", accent: "bg-purple-100" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500", accent: "bg-orange-100" },
  red: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500", accent: "bg-red-100" },
};

export function BoardColumn({ column, invitedTasks, disableEditDelete, disableDnD }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
  });

  const queryClient = useQueryClient();

  const [showAddCard, setShowAddCard] = useState(false);
  const [showEditColumnDialogOpen, setShowEditColumnDialogOpen] = useState(false);
  const [showDeleteColumnDialogOpen, setShowDeleteColumnDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Always call the hook, but ignore its result if invitedTasks is provided
  const { data: tasksData, isLoading: isTasksLoading } = useGetTaskByColumn(column._id);
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const { mutate: updateColumn, isPending: isUpdatingColumn } = useUpdateColumn();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: bulkUpdateTaskPositions } = useBulkUpdateTaskPositions();

  // Local state for task order
  const [tasks, setTasks] = useState<any[]>([]);

  const getColumnColor = () => {
    const colors = Object.values(columnColors);
    const index = column.title.length % colors.length;
    return colors[index];
  };

  const columnColor = getColumnColor();

  // Simple minimalist design without colors

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

  const activeTasks = tasks.filter((task) => !task?.isArchived);
  const isEmpty = activeTasks.length === 0;

  return (
    <>
      <Card 
        className={cn(
          "h-fit w-80 flex-shrink-0 gap-0 rounded-xl border border-gray-200 p-0 px-0 shadow-sm transition-all duration-200 hover:shadow-md bg-white",
          isOver && "ring-2 ring-gray-300 ring-opacity-50 scale-[1.01]",
          isHovered && "shadow-md border-gray-300"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="rounded-t-xl border-b border-gray-100 p-4 px-5 pb-3 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* {!disableDnD && (
                <GripVertical className="h-4 w-4 text-gray-400 cursor-grab hover:text-gray-600 transition-colors" />
              )} */}
                     <div className={cn("h-3 w-3 rounded-full shadow-sm", columnColor.dot)}></div>
              <CardTitle className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
                {column.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm transition-all duration-200">
                {tasks.length}
              </span>
              {!disableEditDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-gray-100 hover:shadow-sm"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 border border-gray-200 bg-white shadow-lg rounded-lg"
                  >
                    <DropdownMenuItem
                      onClick={() => setShowEditColumnDialogOpen(true)}
                      className="flex cursor-pointer items-center gap-2 text-sm hover:bg-gray-50 rounded-md mx-1 my-1"
                    >
                      <Edit3 className="h-4 w-4 text-gray-500" />
                      Edit column
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteColumnDialogOpen(true)}
                      className="flex cursor-pointer items-center gap-2 text-sm text-red-600 hover:bg-red-50 rounded-md mx-1 my-1"
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
        
        <CardContent className={cn(
          "max-h-[calc(100vh-340px)] overflow-y-auto px-4 pr-3 pb-1 pt-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 bg-white",
          disableDnD && "pb-4",
          isEmpty && "flex items-center justify-center py-8"
        )}>
          {isEmpty && !showAddCard ? (
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium">No tasks yet</p>
              <p className="text-xs text-gray-400 mt-1">Add your first task to get started</p>
            </div>
          ) : (
            <>
              {!disableDnD ? (
                <DndContext onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={activeTasks.map((task) => task?._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div ref={setNodeRef} className={cn(
                      "min-h-[1px] space-y-3 transition-all duration-200",
                      isOver && "bg-blue-50/50 rounded-lg p-2 -m-2"
                    )}>
                      {activeTasks.map((task, index) => (
                        <div
                          key={task?._id}
                          className="animate-in slide-in-from-top-2 duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TaskCard 
                            task={task} 
                            disableDnD={disableDnD} 
                            disableEditDelete={disableEditDelete} 
                          />
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="min-h-[1px] space-y-3">
                  {activeTasks.map((task, index) => (
                    <div
                      key={task?._id}
                      className="animate-in slide-in-from-top-2 duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TaskCard 
                        task={task} 
                        disableDnD={disableDnD} 
                        disableEditDelete={disableEditDelete} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
        
        {!disableEditDelete && (
          <CardFooter className="px-4 pb-3">
            {showAddCard ? (
              <div className="w-full animate-in slide-in-from-top-2 duration-200">
                <AddCardInput
                  onAdd={handleAddTask}
                  onCancel={() => setShowAddCard(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                disabled={isCreatingTask}
                className={cn(
                  "mt-2 w-full justify-start  rounded-lg border-2 border-dashed px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-white/60 hover:shadow-sm hover:border-gray-400 hover:text-gray-700 group",
                  // columnColor.border,
                  isCreatingTask && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => setShowAddCard(true)}
              >
                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                {isCreatingTask ? "Adding..." : "Add a card"}
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