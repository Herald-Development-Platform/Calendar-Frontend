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
import { Plus } from "lucide-react";
import { useCreateColumn } from "@/services/api/taskManagement/columnsApi";
import toast from "react-hot-toast";

export function AddColumnDialog() {
  const [title, setTitle] = useState("");

  // API CALLS
  const { mutate: createColumn } = useCreateColumn();

  const handleAdd = () => {
    if (!title.trim()) return;
    // onAdd(title.trim())

    createColumn(title.trim(), {
      onSuccess: () => {
        toast.success("Column added successfully!");
        setTitle("");
      },
      onError: (error) => {
        toast.error(
          (error as any)?.response?.data?.message || "Failed to add column",
        );
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Column
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="columnTitle">Column Title</label>
            <Input
              id="columnTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title..."
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button size="sm" onClick={handleAdd} disabled={!title.trim()}>
            Add Column
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
