import { Button } from "@/components/ui/button";
import { LayoutList, Plus } from "lucide-react";
import React from "react";
import AddBoardTemp from "./AddBoardTemp";
import BoardCard from "./BoardCard";
import BoardFormPopover from "./BoardFormPopover";

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
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        },
        {
          fullName: "Bob Smith",
          email: "bob@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        },
        {
          fullName: "Charlie Brown",
          email: "charlie@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
        },
        {
          fullName: "Diana Lee",
          email: "diana@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
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
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eve",
        },
        {
          fullName: "Frank Miller",
          email: "frank@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
        },
        {
          fullName: "Grace Lee",
          email: "grace@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
        },
        {
          fullName: "Henry Davis",
          email: "henry@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
        },
        {
          fullName: "Iris Martinez",
          email: "iris@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Iris",
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
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
        },
        {
          fullName: "Kate Anderson",
          email: "kate@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kate",
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
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
        },
        {
          fullName: "Mia Jackson",
          email: "mia@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
        },
        {
          fullName: "Noah White",
          email: "noah@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
        },
        {
          fullName: "Olivia Harris",
          email: "olivia@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
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
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
        },
        {
          fullName: "Quinn Roberts",
          email: "quinn@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn",
        },
        {
          fullName: "Ruby Clark",
          email: "ruby@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby",
        },
        {
          fullName: "Sam Lewis",
          email: "sam@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
        },
        {
          fullName: "Tina Walker",
          email: "tina@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tina",
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
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uma",
        },
        {
          fullName: "Victor Scott",
          email: "victor@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Victor",
        },
        {
          fullName: "Wendy Green",
          email: "wendy@example.com",
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wendy",
        },
      ],
    },
  ];

  return (
    <section className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LayoutList />
          <h2 className="text-lg font-semibold">Your Boards</h2>
        </div>

        <BoardFormPopover onSubmit={() => {}}>
          <Button size={"sm"} className="rounded-xl px-4 font-normal">
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </BoardFormPopover>
      </div>

      {/* Boards Cards */}
      <div className="mt-6 grid grid-cols-5 gap-4">
        <BoardFormPopover align="start" side="right" onSubmit={() => {}}>
          <AddBoardTemp />
        </BoardFormPopover>
        {boards.map((board, index) => (
          <BoardCard
            key={index}
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
