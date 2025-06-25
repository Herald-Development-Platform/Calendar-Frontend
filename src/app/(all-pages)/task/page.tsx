"use client";

import React from "react";
import * as Headers from "@/components/Header";
import ArchieveSheet from "@/components/task/ArchieveSheet";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { AddColumnDialog } from "@/components/task/add-column-dialog";

const TaskPage = () => {
  return (
    <>
      <Headers.GeneralHeader />
      <main className="p-4">
        <h1 className="text-2xl font-semibold">Task Boardss</h1>

        <div className="flex items-center  justify-end gap-2">
          <ArchieveSheet
            archivedTasks={[]}
            onRestore={() => {}}
            onDelete={() => {}}
            onEdit={() => {}}
          >
            <Button variant="outline" size='sm'>
              <Archive className="mr-2 h-4 w-4" />
              Archived ({[].length})
            </Button>
          </ArchieveSheet>
          <AddColumnDialog/>
        </div>
      </main>
    </>
  );
};

export default TaskPage;
