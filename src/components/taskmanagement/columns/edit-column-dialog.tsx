"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITaskColumnBase } from "@/types/taskmanagement/column.types";
import { Edit3, LayoutList, Save } from "lucide-react";

interface EditColumnDialogProps {
  column?: ITaskColumnBase;
  isOpen: boolean;
  onClose: () => void;
  onSave: (columnId: string, title: string) => void;
}

export function EditColumnDialog({
  column,
  isOpen,
  onClose,
  onSave,
}: EditColumnDialogProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (column) {
      setTitle(column.title);
    }
  }, [column]);

  const handleSave = () => {
    if (!title.trim() || !column) return;
    onSave(column._id, title.trim());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Edit3 className="h-5 w-5 text-theme" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Edit Column
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500">
                Update the column title and settings
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
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <p className="text-xs text-gray-500">
              Choose a descriptive name that reflects the column&apos;s purpose
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="min-w-[80px]"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!title.trim() || (title === column?.title)}
            className="min-w-[120px] "
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
