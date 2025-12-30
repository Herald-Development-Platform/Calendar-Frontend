import { LayoutList } from "lucide-react";
import React from "react";

const InvitedBoardsSection = () => {
  return (
    <section className="px-8 py-8">
      <div className="flex items-center gap-4">
        <LayoutList />
        <h2 className="text-lg font-semibold">Invited Boards</h2>
      </div>
    </section>
  );
};

export default InvitedBoardsSection;
