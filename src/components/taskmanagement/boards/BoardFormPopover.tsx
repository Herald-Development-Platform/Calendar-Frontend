"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Check } from "lucide-react";

interface BoardFormData {
  name: string;
  description: string;
  color: string;
}

interface BoardFormPopoverProps {
  board?: BoardFormData;
  onSubmit: (data: BoardFormData) => Promise<void>;
  children?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

const BOARD_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#64748b", // slate
  "#6b7280", // gray
];

const BoardFormPopover: React.FC<BoardFormPopoverProps> = ({  
  board, 
  onSubmit, 
  children,
  side = "bottom",
  align = "end",
}) => {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BoardFormData>({
    defaultValues: {
      name: board?.name || "",
      description: board?.description || "",
      color: board?.color || BOARD_COLORS[0],
    },
  });

  const selectedColor = watch("color");

  const onFormSubmit = async (data: BoardFormData) => {
    await onSubmit(data);
    setOpen(false);
    reset();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && board) {
      reset({
        name: board.name,
        description: board.description,
        color: board.color,
      });
    } else if (!newOpen) {
      reset();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">
          {children || (
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {board ? "Edit Board" : "New Board"}
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" side={side} align={align}>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-3">
              {board ? "Edit Board" : "Create Board"}
            </h3>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Board Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              placeholder="Enter board name"
              {...register("name", { required: "Board name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter board description (optional)"
              rows={3}
              {...register("description")}
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Board Color</label>
            <div className="grid grid-cols-9 gap-2">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className="w-8 h-8 rounded-md border-2 transition-all hover:scale-110 relative"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? "#000" : "transparent",
                  }}
                >
                  {selectedColor === color && (
                    <Check className="h-4 w-4 absolute inset-0 m-auto text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {board ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default BoardFormPopover;