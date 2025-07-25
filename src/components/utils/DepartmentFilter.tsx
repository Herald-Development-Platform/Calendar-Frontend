import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState, forwardRef, ForwardedRef } from "react";
import DepartmentButton from "../DepartmentButton";
import { useGetEventByQuery } from "@/services/api/eventsApi";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { useGetDepartments } from "@/services/api/departments";
import { useDebounce } from "@/hooks/useDebounce";

// interface eventByParamsType {
//   q: string;
//   departments: string[];
//   colors: string[];
//   eventTo: number | string;
//   eventFrom: number | string;
// }

const DepartmentFilter = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
  const { data: departments } = useGetDepartments();

  const [selDepartments, setSelDepartments] = useState<string[]>([]);

  const { setEvents } = useContext(Context);

  const { data: eventsData, refetch: refetchEventByQuery } = useGetEventByQuery({
    q: "",
    departments: selDepartments,
    colors: [],
    eventTo: "",
    eventFrom: "",
  });

  const handleFilterEvents = () => {
    if (!Array.isArray(eventsData)) return;
    if (selDepartments.length === 0) {
      setEvents(eventsData);
      return;
    } else {
      const filteredEvents = eventsData.filter((event: eventType) => {
        const departmentExist: boolean =
          selDepartments.length === 0 ||
          event.departments.some((department: any) => selDepartments.includes(department._id));

        return departmentExist;
      });

      setEvents(filteredEvents);
    }
  };

  useEffect(() => handleFilterEvents(), [eventsData, selDepartments]);

  const handleDepartments = (e: any) => {
    const { name, value } = e.currentTarget;
    if (selDepartments && selDepartments.includes(value)) {
      setSelDepartments(selDepartments.filter(dep => dep !== value));
    } else {
      setSelDepartments((prev: any) => [...prev, value]);
    }
  };

  return (
    <div
      ref={ref}
      className="hide-scrollbar sticky top-0 ml-2 flex max-w-[60vw] gap-2 overflow-x-scroll bg-white pb-4 "
    >
      {Array.isArray(departments) &&
        departments?.map((department: any) => (
          <DepartmentButton
            key={department._id}
            onClick={handleDepartments}
            id={department._id}
            value={department.code}
            selected={selDepartments?.includes(department._id)}
          />
        ))}
    </div>
  );
});
DepartmentFilter.displayName = "DepartmentFilter";

export default DepartmentFilter;
