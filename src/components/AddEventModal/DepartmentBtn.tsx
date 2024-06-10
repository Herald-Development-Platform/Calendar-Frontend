import React, { useState } from "react";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { ImCross } from "react-icons/im";

export default function DepartmentBtn({ department, setNewEvent, index }: any) {
  const [isDeletable, setIsDeletable] = useState(false);
  return (
    <>
      <span
        tabIndex={0}
        className={`focus: group flex h-fit w-fit cursor-pointer items-center gap-2 rounded-full border border-neutral-300 px-4  py-2  text-xs  leading-4  transition-colors  duration-300 ease-out  hover:bg-neutral-200 ${
          isDeletable
            ? "bg-primary-500 text-white hover:bg-primary-600"
            : "text-black"
        } `}
        // key={index}
        onClick={(e) => {
          if (!isDeletable) {
            setNewEvent((prev: any) => ({
              ...prev,
              departments: [...prev?.departments, department?.code],
            }));
            return setIsDeletable(true);
          }

          setNewEvent((prev: eventType) => ({
            ...prev,
            departments: prev.departments.filter(
              (dep) => dep !== department?.code,
            ),
          }));
          setIsDeletable(false);
        }}
      >
        <span
          className={`${
            isDeletable ? "flex text-lg  text-white" : "hidden"
          }  font-extrabold`}
        >
          <RxCross2 />
        </span>
        {department?.code}
      </span>
    </>
  );
}
