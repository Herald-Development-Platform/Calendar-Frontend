"use client";

import React, { useState, useEffect, useContext } from "react";
import * as Headers from "@/components/Header";
import ArchieveSheet from "@/components/taskmanagement/ArchieveSheet";
import { AddColumnDialog } from "@/components/taskmanagement/columns/add-column-dialog";
import { Context } from "@/app/clientWrappers/ContextProvider";

import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useGetColumns } from "@/services/api/taskManagement/columnsApi";
import { ITaskColumnBase } from "@/types/taskmanagement/column.types";
import { BoardColumn } from "@/components/taskmanagement/columns/board-column";
import { useUpdateTask } from "@/services/api/taskManagement/taskApi";
import { useGetInvitedTasks } from "@/services/api/taskManagement/taskApi";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const TaskPage = () => {
  const { sidebarOpen } = useContext(Context);

  const [showInvitedColumn, setShowInvitedColumn] = useState(false);

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
      <main
        className={`pl-0 pr-0 transition-all ${sidebarOpen ? "xl:max-w-[calc(100vw-248px)]" : "xl:max-w-[calc(100vw-95px)]"}`}
      >
        <div className="flex items-center justify-end  gap-2 pr-8">
          <ArchieveSheet />
          <Button
            onClick={() => setShowInvitedColumn(prev => !prev)}
            variant="outline"
            size="sm"
            className={cn("relative font-normal",
              showInvitedColumn ? "border-theme text-theme bg-[#f4faf0] hover:text-theme hover:bg-[#f4faf0]" : ""
            )}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            View Invited List
          </Button>
          <AddColumnDialog />
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="mt-6 flex min-h-[calc(100vh-240px)] h-full gap-3 overflow-x-auto pb-1">
            {/* Invited Tasks */}
            {showInvitedColumn && (
              <div className="sticky left-0 z-[5] flex-shrink-0 border-r border-gray-200 bg-white px-3 pt-2">
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
            )}
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
