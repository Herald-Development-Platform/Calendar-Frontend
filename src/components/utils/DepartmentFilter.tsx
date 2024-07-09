import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import DepartmentButton from "../DepartmentButton";

export default function DepartmentFilter() {
  const { data: departments } = useQuery<eventType[]>({
    queryKey: ["Departments"],
  });
  const [selDepartments, setSelDepartments] = useState<string[]>([""]);
  const handleDepartments = (e: any) => {
    console.log("e", e);
    const { name, value } = e.currentTarget;
    if (selDepartments && selDepartments.includes(value)) {
      setSelDepartments(selDepartments.filter((dep) => dep !== value));
    } else {
      console.log("seldepartments", value);
      setSelDepartments((prev: any) => [...prev, value]);
    }
  };
  return (
    <div className="flex gap-2">
      {departments?.map((department: any) => (
        <DepartmentButton
          key={department.code}
          onClick={handleDepartments}
          id={department.code}
          value={department.code}
          selected={selDepartments?.includes(department.code)}
        />
      ))}
    </div>
  );
}
