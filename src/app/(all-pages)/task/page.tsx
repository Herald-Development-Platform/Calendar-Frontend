"use client";

import React, { useState, useEffect, useContext } from "react";
import * as Headers from "@/components/Header";
import ArchieveSheet from "@/components/taskmanagement/ArchieveSheet";
import { AddColumnDialog } from "@/components/taskmanagement/columns/add-column-dialog";
import { Context } from "@/app/clientWrappers/ContextProvider";

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useGetColumns } from "@/services/api/taskManagement/columnsApi";
import { ITaskColumnBase } from "@/types/taskmanagement/column.types";
import { BoardColumn } from "@/components/taskmanagement/columns/board-column";
import { useUpdateTask } from "@/services/api/taskManagement/taskApi";
import { useGetInvitedTasks } from "@/services/api/taskManagement/taskApi";

const TaskPage = () => {
  const { sidebarOpen } = useContext(Context);

  // API CALLS
  const { data: columnsData, isLoading: isColumnsLoading } = useGetColumns();
  const { data: invitedTasksData, isLoading: isInvitedLoading } = useGetInvitedTasks();

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
    })
  );

  // DnD Handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const taskId = active.id as string;
    const overId = over.id as string;

    // Find the column containing the task
    const colIdx = columns.findIndex(col => col.tasks.some((t: any) => t._id === taskId));
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
    reordered.forEach(task => updateTask(task));
  };

  return (
    <>
      <Headers.TaskHeader />
      <main className={`pl-0 pr-0 transition-all ${sidebarOpen ? 'xl:max-w-[calc(100vw-248px)]' : 'xl:max-w-[calc(100vw-82px)]'}`}>

        <div className="flex items-center pr-8  justify-end gap-2">
          <ArchieveSheet />
          <AddColumnDialog />
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="mt-6 flex gap-3 min-h-[calc(100vh-170px)] overflow-x-auto pb-1">
            {columns.map((column: ITaskColumnBase) => (
              <BoardColumn
                key={column._id}
                column={column}
                // tasks={column.tasks ? [...column.tasks].sort((a, b) => a.position - b.position) : []}
              />
            ))}

            {/* Invited Tasks */}
            <BoardColumn
              key="invited"
              column={{
                _id: "invited",
                title: "Invited Column",
                position: 9999,
                isArchived: false,
                createdAt: new Date().toISOString(),
              }}
              invitedTasks={invitedTasksData?.data || []}
              disableEditDelete
              disableDnD
            />
          </div>
        </DndContext>
      </main>
    </>
  );
};

export default TaskPage;
