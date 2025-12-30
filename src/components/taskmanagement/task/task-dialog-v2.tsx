import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ITask } from "@/types/taskmanagement/task.types";
import React from "react";

interface TaskDialogProps {
  openTaskDialog: boolean;
  setOpenTaskDialog: (open: boolean) => void;
  task: ITask;
  disableEditDelete?: boolean;
}

const TaskDialog = ({
  task,
  openTaskDialog,
  setOpenTaskDialog,
  disableEditDelete,
}: TaskDialogProps) => {
  return <Dialog>
    <DialogContent>
        
    </DialogContent>
  </Dialog>;
};

export default TaskDialog;
