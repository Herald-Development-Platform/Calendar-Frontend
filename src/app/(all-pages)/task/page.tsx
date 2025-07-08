"use client";

import React, { useState, useEffect } from "react";
import * as Headers from "@/components/Header";
import ArchieveSheet from "@/components/taskmanagement/ArchieveSheet";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { AddColumnDialog } from "@/components/taskmanagement/columns/add-column-dialog";

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useGetColumns } from "@/services/api/taskManagement/columnsApi";
import { ITaskColumnBase } from "@/types/taskmanagement/column.types";
import { BoardColumn } from "@/components/taskmanagement/columns/board-column";
import { useUpdateTask } from "@/services/api/taskManagement/taskApi";

const TaskPage = () => {
  // API CALLS
  const { data: columnsData, isLoading: isColumnsLoading } = useGetColumns();

  // Local state for columns and tasks for optimistic UI
  const [columns, setColumns] = useState<any[]>([]);
  const { mutate: updateTask } = useUpdateTask();

  useEffect(() => {
    if (columnsData?.data) {
      // Ensure each column has a tasks array
      setColumns(
        columnsData.data.map((col: any) => ({
          ...col,
          tasks: col.tasks ? [...col.tasks] : [],
        }))
      );
    }
  }, [columnsData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // DnD Handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const taskId = active.id as string;
    const overId = over.id as string;

    // Find the column containing the task
    const colIdx = columns.findIndex((col) => col.tasks.some((t: any) => t._id === taskId));
    if (colIdx === -1) return;
    const column = columns[colIdx];
    const oldIndex = column.tasks.findIndex((t: any) => t._id === taskId);
    const newIndex = column.tasks.findIndex((t: any) => t._id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder tasks
    const reordered = [...column.tasks];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);
    // Update positions
    reordered.forEach((task, idx) => {
      task.position = idx;
    });
    // Update state
    const newColumns = [...columns];
    newColumns[colIdx] = { ...column, tasks: reordered };
    setColumns(newColumns);
    // Persist changes
    reordered.forEach((task) => updateTask(task));
  };

  return (
    <>
      <Headers.GeneralHeader />
      <main className="p-4 xl:max-w-[calc(100vw-260px)]">
        <h1 className="text-2xl font-semibold">Task Boardss</h1>

        <div className="flex items-center  justify-end gap-2">
          <ArchieveSheet/>
           
        
          <AddColumnDialog />
        </div>

        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6 mt-10">
            {columns.map((column: ITaskColumnBase) => (
              <BoardColumn
                key={column._id}
                column={column}
                // tasks={column.tasks ? [...column.tasks].sort((a, b) => a.position - b.position) : []}
              />
            ))}

            

          </div>
        </DndContext>
      </main>
    </>
  );
};

export default TaskPage;
