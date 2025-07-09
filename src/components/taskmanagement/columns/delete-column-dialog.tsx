"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteColumn } from "@/services/api/taskManagement/columnsApi";
import { ITaskColumnBase } from "@/types/taskmanagement/column.types";
import { ITask } from "@/types/taskmanagement/task.types";
import { useQueryClient } from "@tanstack/react-query";

import { AlertTriangle, Archive, Clock, Plus, Trash2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

const DeleteColumnDialog = ({
  columnId,
  columnTitle,
  showDialog,
  setShowDialog,
}: {
  columnId: string;
  columnTitle: string;
  showDialog: boolean;
  setShowDialog: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const { mutate: deleteColumn, isPending: isDeletingColumn } =
    useDeleteColumn();

  const handleDeleteColumn = () => {
    if (isDeletingColumn) return;

    const queryKey = ["columns"];
    const existing = queryClient.getQueryData<{ data: ITaskColumnBase[] }>(
      queryKey,
    );
    const previousColumns = existing?.data || [];

    // Optimistically update columns cache
    const updatedColumns = previousColumns.filter(
      (col) => col._id !== columnId,
    );
    queryClient.setQueryData(queryKey, {
      data: updatedColumns,
    });

    // Get all tasks in this column to archive later
    const tasksKey = ["tasks", columnId];
    const columnTasksData = queryClient.getQueryData<{ data: ITask[] }>(
      tasksKey,
    );
    const columnTasks = columnTasksData?.data || [];

    deleteColumn(columnId, {
      onSuccess: () => {
        toast.success("Column deleted successfully!");

        // Update columns cache (optional here since optimistic already done)
        queryClient.setQueryData(queryKey, {
          data: updatedColumns,
        });

        // Update archived tasks cache by adding tasks from deleted column
        const archivedKey = ["archived-tasks"];
        const archivedData = queryClient.getQueryData<{ data: ITask[] }>(
          archivedKey,
        );
        const archivedTasks = archivedData?.data || [];

        queryClient.setQueryData(archivedKey, {
          data: [...archivedTasks, ...columnTasks],
        });

        // Optionally remove the tasks cache for this deleted column
        queryClient.removeQueries({
          queryKey: tasksKey,
        });
      },
      onError: (error) => {
        toast.error(
          (error as any)?.response?.data?.message || "Failed to delete column",
        );

        // Revert columns cache on error
        queryClient.setQueryData(queryKey, {
          data: previousColumns,
        });
      },
    });
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Delete Column
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500">
                This action cannot be undone
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border-l-4 border-red-400 bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              You&apos;re about to delete the column{" "}
              <span className="font-semibold text-gray-900">
                &quot;{columnTitle}&quot;
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              What happens next:
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Archive className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>All tasks in this column will be archived</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>Archived tasks can be restored later if needed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="min-w-[80px]">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteColumn}
            className="min-w-[120px] bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Column
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteColumnDialog;
