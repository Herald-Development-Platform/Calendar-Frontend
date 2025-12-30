"use client";

import React, { useState } from "react";
import * as Headers from "@/components/Header";
import YourBoardsSection from "@/components/taskmanagement/boards/your-boards-section";
import InvitedBoardsSection from "@/components/taskmanagement/boards/invited-boards-section";

const TaskBoardPage = () => {
  const [search, setSearch] = useState("");

  return (
    <>
      <Headers.TaskBoardHeader search={search} setSearch={setSearch} />
      <YourBoardsSection />
      <InvitedBoardsSection />
    </>
  );
};

export default TaskBoardPage;
