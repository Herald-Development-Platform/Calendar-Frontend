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
import { useCreateTask } from "@/services/api/taskManagement/taskApi";
import toast from "react-hot-toast";

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

  const [showAddCard, setShowAddCard] = useState(false);

  // API CALLS
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();

  const handleAddTask = (title: string) => {
    createTask(
      { title, column: column._id },
      {
        onSuccess: () => {
          setShowAddCard(false);
        },
        onError: (error) => {
          toast.error(
            (error as any)?.response?.data?.message || "Failed to create task",
          );
        },
      },
    );
  };

  const tasks: any = [];

  return (
    <Card className="h-fit w-80 flex-shrink-0 gap-0 rounded border p-0 px-0 shadow">
      <CardHeader className="p-4 px-5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
          <div className="flex items-center gap-1">
            <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              {tasks.length}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                //  onClick={() => onEditColumn(column.id)}
                >
                  Edit column
                </DropdownMenuItem>
                <DropdownMenuItem
                  // onClick={() => onDeleteColumn(column.id)}
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
        <div ref={setNodeRef} className="min-h-[1px] space-y-2">
          <SortableContext
            items={tasks.map((task: ITask) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks
              .filter((task: ITask) => !task.archived)
              .map((task: ITask) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  // onEdit={onEditTask}
                  // onArchive={onArchiveTask}
                  // onToggleComplete={onToggleComplete}
                />
              ))}
          </SortableContext>
        </div>
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
  );
}
