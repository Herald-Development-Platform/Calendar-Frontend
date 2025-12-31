import { Button } from "@/components/ui/button";
import { LayoutList, Plus } from "lucide-react";
import React from "react";
import AddBoardTemp from "./AddBoardTemp";
import BoardCard from "./BoardCard";
import BoardFormPopover from "./BoardFormPopover";
import { useCreateBoard, useGetBoards } from "@/services/api/taskManagement/boardApi";
import { TBoardData, TBoardFormData } from "@/types/taskmanagement/board.types";
import { useQueryClient } from "@tanstack/react-query";

interface InvitedMember {
  fullName: string;
  email: string;
  profile: string;
}

interface Board {
  name: string;
  invitedMembers: InvitedMember[];
  color: string;
}

const YourBoardsSection = () => {
  const boards: Board[] = [
    {
      name: "Frontend Development",
      color: "bg-blue-500",
      invitedMembers: [
        {
          fullName: "Alice Johnson",
          email: "alice@example.com",
          profile: "",
        },
        {
          fullName: "Bob Smith",
          email: "bob@example.com",
          profile: "",
        },
        {
          fullName: "Charlie Brown",
          email: "charlie@example.com",
          profile: "",
        },
        {
          fullName: "Diana Lee",
          email: "diana@example.com",
          profile: "",
        },
      ],
    },
    {
      name: "Backend Development",
      color: "bg-purple-500",
      invitedMembers: [
        {
          fullName: "Eve Wilson",
          email: "eve@example.com",
          profile: "",
        },
        {
          fullName: "Frank Miller",
          email: "frank@example.com",
          profile: "",
        },
        {
          fullName: "Grace Lee",
          email: "grace@example.com",
          profile: "",
        },
        {
          fullName: "Henry Davis",
          email: "henry@example.com",
          profile: "",
        },
        {
          fullName: "Iris Martinez",
          email: "iris@example.com",
          profile: "",
        },
      ],
    },
    {
      name: "Design System",
      color: "bg-pink-500",
      invitedMembers: [
        {
          fullName: "Jack Taylor",
          email: "jack@example.com",
          profile: "",
        },
        {
          fullName: "Kate Anderson",
          email: "kate@example.com",
          profile: "",
        },
      ],
    },
    {
      name: "Mobile App",
      color: "bg-green-500",
      invitedMembers: [
        {
          fullName: "Liam Thomas",
          email: "liam@example.com",
          profile: "",
        },
        {
          fullName: "Mia Jackson",
          email: "mia@example.com",
          profile: "",
        },
        {
          fullName: "Noah White",
          email: "noah@example.com",
          profile: "",
        },
        {
          fullName: "Olivia Harris",
          email: "olivia@example.com",
          profile: "",
        },
      ],
    },
    {
      name: "Testing & QA",
      color: "bg-orange-500",
      invitedMembers: [
        {
          fullName: "Peter Martin",
          email: "peter@example.com",
          profile: "",
        },
        {
          fullName: "Quinn Roberts",
          email: "quinn@example.com",
          profile: "",
        },
        {
          fullName: "Ruby Clark",
          email: "ruby@example.com",
          profile: "",
        },
        {
          fullName: "Sam Lewis",
          email: "sam@example.com",
          profile: "",
        },
        {
          fullName: "Tina Walker",
          email: "tina@example.com",
          profile: "",
        },
      ],
    },
    {
      name: "DevOps & Infrastructure",
      color: "bg-red-500",
      invitedMembers: [
        {
          fullName: "Uma Patel",
          email: "uma@example.com",
          profile: "",
        },
        {
          fullName: "Victor Scott",
          email: "victor@example.com",
          profile: "",
        },
        {
          fullName: "Wendy Green",
          email: "wendy@example.com",
          profile: "",
        },
      ],
    },
  ];

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useCreateBoard();
  const { data: boardsList, isLoading } = useGetBoards();

  const handleCreateBoard = async (data: any) => {
    try {
      // Map form data to API schema (name -> title)
      const boardData: TBoardFormData = {
        name: data.name,
        description: data.description,
        color: data.color,
      };

      // Create the board
      const response = await mutateAsync(boardData);

      const newBoard = response?.data?.board;

      console.log("Board created successfully:", response);

      // Invalidate and refetch boards query to update the cache
      queryClient.invalidateQueries({ queryKey: ["boards"] });

      // Optionally, optimistically update the cache
      // queryClient.setQueryData(["boards"], (old: any) => {
      //   return old ? [...old, newBoard] : [newBoard];
      // });
    } catch (error) {
      console.error("Error creating board:", error);
      throw error; // Re-throw to handle in the form
    }
  };

  return (
    <section className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LayoutList />
          <h2 className="text-lg font-semibold">Your Boards</h2>
        </div>

        <BoardFormPopover onSubmit={handleCreateBoard}>
          <Button size={"sm"} className="rounded-xl px-4 font-normal" disabled={isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </BoardFormPopover>
      </div>

      {/* Boards Cards */}
      <div className="mt-6 grid grid-cols-5 gap-4">
        <BoardFormPopover align="start" side="right" onSubmit={handleCreateBoard}>
          <AddBoardTemp />
        </BoardFormPopover>
        {boardsList?.data?.boards?.map((board: TBoardData, index: number) => (
          <BoardCard
            key={index}
            boardId={board._id}
            name={board.name}
            invitedMembers={board.invitedMembers}
            color={board.color}
          />
        ))}
      </div>
    </section>
  );
};

export default YourBoardsSection;
