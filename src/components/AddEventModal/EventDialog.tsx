import React, { useEffect, useImperativeHandle, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AiOutlinePlus } from "react-icons/ai";
import EventForm from "./EventForm";

export interface EventDialogRef {
  openDialog: () => void;
  closeDialog: () => void;
}

const EventDialog = React.forwardRef<EventDialogRef, { type: string; defaultData: any }>(
  ({ type, defaultData }, ref) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Log only when `isDialogOpen` changes to true
    if (isDialogOpen) {
      console.log("Dialog opened");
    }
  }, [isDialogOpen]);

  // Expose method to parent through `useImperativeHandle`
  useImperativeHandle(ref, () => ({
    openDialog: () => {
      console.log("openDialog called");
      if (!isDialogOpen) {
        setIsDialogOpen(true); // Open dialog only if it's not already open
      }
    },
    closeDialog: () => {
      console.log("closeDialog called");
      if (isDialogOpen) {
        setIsDialogOpen(false); // Close dialog only if it's open
      }
    },
  }));
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className=" btn btn-sm
           relative flex h-8 w-32 rounded border-none bg-primary-600 px-3 py-2 text-xs font-semibold text-primary-50 outline-none hover:bg-primary-400"
        >
          <AiOutlinePlus className="h-4 w-4 font-bold text-primary-50" />
          {type} Event
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] h-[600px] overflow-y-scroll hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-center">
            {" "}
            <h3 className="text-lg font-bold">{type} Event</h3>
          </DialogTitle>
        </DialogHeader>
        <EventForm type={type} defaultData={defaultData}/>
      </DialogContent>
    </Dialog>
  );
});

export default EventDialog;
