"use client";

import React from "react";
import * as Headers from "@/components/Header";
import ArchieveSheet from "@/components/task/ArchieveSheet";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { AddColumnDialog } from "@/components/task/columns/add-column-dialog";

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
import { BoardColumn } from "@/components/task/columns/board-column";

const TaskPage = () => {
  // API CALLS
  const { data: columnsData, isLoading: isColumnsLoading } = useGetColumns();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <>
      <Headers.GeneralHeader />
      <main className="p-4">
        <h1 className="text-2xl font-semibold">Task Boardss</h1>

        <div className="flex items-center  justify-end gap-2">
          <ArchieveSheet
            archivedTasks={[]}
            onRestore={() => {}}
            onDelete={() => {}}
            onEdit={() => {}}
          >
            <Button variant="outline" size="sm">
              <Archive className="mr-2 h-4 w-4" />
              Archived ({[].length})
            </Button>
          </ArchieveSheet>
          <AddColumnDialog />
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={() => {}}
          onDragOver={() => {}}
          onDragEnd={() => {}}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columnsData?.data?.map((column: ITaskColumnBase) => (
              <BoardColumn key={column._id} column={column} />
            ))}
          </div>
        </DndContext>
      </main>
    </>
  );
};

export default TaskPage;
