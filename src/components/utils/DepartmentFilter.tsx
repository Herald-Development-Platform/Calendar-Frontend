import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import DepartmentButton from "../DepartmentButton";
import { useGetEventByQuery } from "@/services/api/eventsApi";
import { Context } from "@/app/clientWrappers/ContextProvider";

// interface eventByParamsType {
//   q: string;
//   departments: string[];
//   colors: string[];
//   eventTo: number | string;
//   eventFrom: number | string;
// }

export default function DepartmentFilter() {
  const { data: departments } = useQuery<eventType[]>({
    queryKey: ["Departments"],
  });
  const [selDepartments, setSelDepartments] = useState<string[]>([""]);
  console.log("selDepartments", selDepartments);
  const { setEvents } = useContext(Context);

  const { data: filteredEvents, refetch: refetchEventByQuery } =
    useGetEventByQuery({
      q: "",
      departments: selDepartments,
      colors: [],
      eventTo: "",
      eventFrom: "",
    });

  useEffect(() => setEvents(filteredEvents), [filteredEvents]);
  useEffect(() => {
    refetchEventByQuery();
  }, [selDepartments]);

  console.log("filteredEvents", filteredEvents);

  const handleDepartments = (e: any) => {
    const { name, value } = e.currentTarget;
    if (selDepartments && selDepartments.includes(value)) {
      setSelDepartments(selDepartments.filter((dep) => dep !== value));
    } else {
      setSelDepartments((prev: any) => [...prev, value]);
    }
  };

  return (
    <div className="flex gap-2">
      {Array.isArray(departments) &&
        departments?.map((department: any) => (
          <DepartmentButton
            onClick={handleDepartments}
            id={department._id}
            value={department.code}
            selected={selDepartments?.includes(department._id)}
          />
        ))}
    </div>
  );
}
