import { FiPlus } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import Endpoints from "@/services/API_ENDPOINTS";
import { Axios } from "@/services/baseUrl";
import { RefObject } from "@fullcalendar/core/preact.js";
import { useQueries, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { Span } from "next/dist/trace";

interface User {
  email: string;
  emailVerified: boolean;
  permissions: string[];
  role: string;
  username: string;
  _id: string;
  photo?: string;
}

export default function InviteMembers({
  memberIds,
  handleInviteMembers,
}: {
  memberIds: string[];
  handleInviteMembers: (user: User, action: "add" | "remove") => void;
}) {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filteredUserData, setFilteredUserData] = useState<
    User[] | null | undefined
  >(null);
  const inviteRef = useRef<HTMLDivElement>(null);

  const handleHidePopover = () => {
    console.log("handleHidePopover");
    setShowPopover(false);
  };

  const { data: userData, isSuccess } = useQuery({
    queryKey: ["UserData"],
    queryFn: async () => await Axios.get(Endpoints.profile),
  });

  useEffect(() => {
    if (!userData?.data.data) return;
    setFilteredUserData([...userData?.data.data]);
  }, [isSuccess, userData?.data.data]);

  const applyFilters = (filterQuery: string) => {
    if (!filterQuery) return;

    const filteredData = userData?.data.data.filter((user: User) => {
      const reg = new RegExp(filterQuery, "ig");
      return reg.test(user.username) || reg.test(user.email);
    });
    setFilteredUserData(filteredData);
  };

  useDebounce({
    dependency: [filterQuery],
    debounceFn: () => applyFilters(filterQuery),
    time: 200,
  });

  // console.log("userData?.data.data --", filteredUserData);
  // useHidePopOver(inviteRef, showPopover, handleHidePopover);

  return (
    <>
      <div
        ref={inviteRef}
        onClick={(e) => {
          e.stopPropagation();
          // setShowPopover(true);
        }}
        className="text-sm"
      >
        <span>Invite Members:</span>
        <div className="flex">
          <div className=" relative flex h-fit w-fit gap-1">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-primary-500 text-base text-white"
              onClick={() => {
                setShowPopover((prev) => !prev);
              }}
            >
              <FiPlus />
            </button>

            {userData?.data?.data
              ?.filter((user: User) => memberIds?.includes(user._id))
              .map((selMembers: User, i: number) => {
                if (selMembers?.photo) {
                  return (
                    <Image
                      src={selMembers.photo}
                      alt={"User Image"}
                      width={33}
                      height={33}
                      className="rounded-full"
                    ></Image>
                  );
                } else {
                  return (
                    <Image
                      src={"/DummyProfile.jpg"}
                      alt={"User Image"}
                      width={33}
                      height={33}
                      className="rounded-full"
                    ></Image>
                  );
                }
              })}

            <div
              className={`${
                showPopover ? "flex" : "hidden"
              } absolute bottom-10 left-5 z-10 h-[600px] max-h-80 w-[500px] flex-col overflow-hidden overflow-y-auto rounded-xl border border-[#d4d4d4] bg-white px-6 py-4`}
            >
              <div className="flex-grow">
                {filteredUserData &&
                  filteredUserData?.map((userData: User) => (
                    <div
                      key={userData._id}
                      className="group flex items-center gap-2 overflow-hidden overflow-y-auto py-[7.5px] pl-[10px] pr-[17px] transition-colors duration-0 hover:bg-neutral-100"
                    >
                      <Image
                        src={"/images/LoginPage/HeraldLogo.png"}
                        height={33}
                        width={33}
                        alt={"user image"}
                        className="rounded-full"
                      ></Image>
                      <div className="flex flex-grow flex-col">
                        <p className="text-sm font-semibold text-neutral-900">
                          {userData?.username}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {userData?.role}
                        </p>
                      </div>
                      <button
                        onClick={() => handleInviteMembers(userData, "add")}
                        className="hidden h-6 w-6 items-center justify-center rounded-full bg-white p-[7.5px] text-xl  group-hover:flex"
                      >
                        <FaPlus></FaPlus>
                      </button>
                    </div>
                  ))}
              </div>
              <label htmlFor="date-search" className="w-full">
                <div className="group flex h-11 w-full items-center gap-2  rounded-sm border-[1px] border-primary-50 bg-neutral-100 px-4 focus-within:border-primary-600">
                  <span className="text-xl">
                    <IoIosSearch />
                  </span>
                  <input
                    type="text"
                    className="group w-full bg-neutral-100 text-sm font-medium text-neutral-500 outline-none"
                    placeholder="Search events, dates, participants..."
                    id="date-search"
                    onChange={(e) => setFilterQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          console.log("close popup");
          setShowPopover(false);
        }}
        className={`${
          showPopover ? "block" : "hidden"
        } absolute left-0 top-0 -z-0 h-[300%] w-full opacity-0 `}
      ></div>

      {/* <div
                        key={userData._id}
                        className="group flex items-center gap-2 overflow-hidden overflow-y-auto py-[7.5px] pl-[10px] pr-[17px] transition-colors duration-0 hover:bg-neutral-100"
                      >
                        <Image
                          src={"/images/LoginPage/HeraldLogo.png"}
                          height={33}
                          width={33}
                          alt={"user image"}
                          className="rounded-full"
                        ></Image>
                        <div className="flex flex-grow flex-col">
                          <p className="text-sm font-semibold text-neutral-900">
                            {userData?.username}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {userData?.role}
                          </p>
                        </div>
                        <button
                          onClick={() => handleInviteMembers(userData, "add")}
                          className="hidden h-6 w-6 items-center justify-center rounded-full bg-white p-[7.5px] text-xl  group-hover:flex"
                        >
                          <FaPlus></FaPlus>
                        </button>
                      </div> */}
    </>
  );
}

const useHidePopOver = (
  inviteRef: RefObject<HTMLDivElement>,
  showPopover: boolean,
  handleHidePopover: () => void,
) => {
  useEffect(() => {
    console.log("showPopover", showPopover);
    if (showPopover) {
      inviteRef.current?.parentNode?.addEventListener(
        "click",
        handleHidePopover,
      );
      inviteRef.current?.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("addevent");
      });
    }

    return () => {
      inviteRef.current?.parentNode?.removeEventListener(
        "click",
        handleHidePopover,
      );
      inviteRef.current?.removeEventListener("click", (e) =>
        e.stopPropagation(),
      );
    };
  }, [showPopover]);
};

// const useDebounce = ({
//   dependency,
//   debounceFn,
//   time,
// }: {
//   dependency: any;
//   debounceFn: () => void;
//   time: number;
// }) => {
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       debounceFn();
//     }, time);

//     return () => clearTimeout(timeout);
//   }, [...dependency]);
// };

// if (userData?.photo) {
//   return (
//     <Image
//       src={userData.photo}
//       alt={"User Image"}
//       width={32}
//       height={32}
//     ></Image>
//   );
// } else {
//   return (
//     <Image
//       src={"/DummyProfile.jpg"}
//       alt={"User Image"}
//       width={32}
//       height={32}
//     ></Image>
//   );
// }

{
  /* <div
key={i}
className="flex h-8 w-auto items-center justify-center rounded-full border border-neutral-300 bg-primary-500 px-3 text-base text-white"
>
{selMembers?.username}
</div> */
}
