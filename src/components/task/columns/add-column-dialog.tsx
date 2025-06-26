"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { LayoutList, Plus } from "lucide-react";
import { useCreateColumn } from "@/services/api/taskManagement/columnsApi";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export function AddColumnDialog() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);

  // API CALLS
  const { mutate: createColumn } = useCreateColumn();

  const handleAdd = () => {
    if (!title.trim()) return;
    // onAdd(title.trim())

    createColumn(title.trim(), {
      onSuccess: () => {
        toast.success("Column added successfully!");
        setTitle("");
        queryClient.invalidateQueries({ queryKey: ["columns"] });
        setShowAddColumnDialog(false);
      },
      onError: (error) => {
        toast.error(
          (error as any)?.response?.data?.message || "Failed to add column",
        );
      },
    });
  };

  return (
    <Dialog open={showAddColumnDialog} onOpenChange={setShowAddColumnDialog}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Column
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Plus className="h-5 w-5 text-theme" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add New Column
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500">
                Create a new column for organizing tasks
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="space-y-2">
            <label
              htmlFor="columnTitle"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <LayoutList className="h-4 w-4 text-gray-400" />
              Column Title
            </label>
            <Input
              id="columnTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., To Do, In Progress, Done..."
              className="h-10"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
            />
            <p className="text-xs text-gray-500">
              Choose a descriptive name that reflects the column's purpose
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="min-w-[80px]">
              Cancel
            </Button>
          </DialogClose>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!title.trim()}
            className="min-w-[100px] "
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Column
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
