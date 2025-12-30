import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

interface InvitedMember {
  fullName: string;
  email: string;
  profile: string;
}

interface BoardCardProps {
  name: string;
  invitedMembers: InvitedMember[];
  color: string;
}

const getInitials = (fullName: string) => {
  return fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const BoardCard = ({ name, invitedMembers, color }: BoardCardProps) => {
  const displayedMembers = invitedMembers.slice(0, 3);
  const remainingCount = invitedMembers.length - 3;
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  return (
    <Link href={"#"} title={name}>
      <div className="flex h-40 flex-col rounded-xl border border-neutral-200 hover:shadow-md transition-shadow">
        <div className={`flex-1 rounded-t-xl ${color} p-2`}></div>
        <div className="rounded-b-xl p-3 py-4 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium truncate">{name}</p>
            {/* Overlapping Member Profiles */}
            <div className="flex items-center -space-x-2">
              {displayedMembers.map((member, index) => (
                <div
                  key={index}
                  className="relative w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden hover:z-10 flex items-center justify-center"
                  title={member.fullName}
                >
                  {imageErrors.has(index) ? (
                    <span className="text-xs font-semibold text-gray-700">
                      {getInitials(member.fullName)}
                    </span>
                  ) : (
                    <Image
                      src={member.profile}
                      alt={member.fullName}
                      fill
                      className="object-cover"
                      sizes="24px"
                      onError={() => handleImageError(index)}
                    />
                  )}
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700">
                  +{remainingCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BoardCard;
