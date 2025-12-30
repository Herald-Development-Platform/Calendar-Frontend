import { Plus } from "lucide-react";
import React from "react";

const AddBoardTemp = () => {
  return (
    <div className="flex h-40 flex-col gap-2 items-center justify-center rounded-xl hover:cursor-pointer border-2 border-dashed border-theme bg-[#f2f9ed] hover:bg-[#e3f2d9]">
      <span className="bg-theme rounded-full p-2">
        <Plus className="text-white" />
      </span>
      <p className="text-neutral-700">
        Add New Board
      </p>
    </div>
  );
};

export default AddBoardTemp;
