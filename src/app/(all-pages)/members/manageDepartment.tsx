import Endpoints from "@/services/API_ENDPOINTS";
import { Axios } from "@/services/baseUrl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HiOutlineUsers, HiArrowNarrowUp } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import DepartmentDetails from "./DepartmentDetails";
import { set } from "date-fns";

export default function ManageDepartment({
  closeDepartmentManagement,
  departments,
  allUsers,
}: {
  closeDepartmentManagement: React.Dispatch<React.SetStateAction<boolean>>;
  departments: Department[];
  events: eventType[];
  allUsers: User[];
}) {
  const { data: eventsData } = useQuery({
    queryKey: ["Events"],
    queryFn: () => Axios.get(Endpoints.event),
  });

  console.log("Events Data from normal: ", eventsData?.data?.data)

  const [departmentEventsCount, setDepartmentEventsCount] = useState<any>();

  const [sideBarDepartment, setSideBarDepartment] = useState<Department>();
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (eventsData?.data?.data && departments) {
      let idOnlyEvents = eventsData?.data?.data.map((e: any) => {
        let newEvent = {...e};
        newEvent.departments = newEvent.departments.map((d: any) => d._id);
        return newEvent;
      });

      let eventsCountMap: any = {};
      let today = new Date();
      today = new Date(today.setHours(0, 0, 0));
      departments.forEach((department) => {
        let eventsForDepartment = idOnlyEvents.filter(
          (e: any) =>
            e.departments.includes(department._id) &&
            new Date(e.start) > today &&
            new Date(e.end) < new Date(Date.now() + 30 * 86400000),
        );
        eventsCountMap[department._id] = eventsForDepartment.length;
      });
      console.log(eventsCountMap);
      setDepartmentEventsCount(eventsCountMap);
    }
  }, [eventsData]);

  return (
    <div className="flex max-w-[50vw] flex-col items-start justify-start gap-7">
      <div className="flex flex-row items-center justify-start gap-2">
        <span
          onClick={() => {
            closeDepartmentManagement(false);
          }}
          className="cursor-pointer text-4xl font-bold text-neutral-600"
        >
          <IoMdArrowBack />
        </span>
        <p className="text-[28px] font-semibold text-neutral-700">
          Manage Department
        </p>
      </div>
      <div className="flex w-full flex-col gap-5">
        {departments &&
          departments.map((department: Department) => {
            return (
              <>
                <div
                  onClick={() => {
                    setSideBarDepartment(department);
                    setSideBarOpen(true);
                    console.log("Department selected: ",department);
                  }}
                  className={`group flex w-full cursor-pointer flex-row items-center gap-[16px] rounded-[4px] px-[12px] py-3 hover:bg-neutral-50`}
                >
                  <div
                    className={`flex  h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-neutral-100 p-[3px] group-hover:bg-neutral-200`}
                  >
                    <HiOutlineUsers className={`text-md text-neutral-600`} />
                  </div>
                  <div className="flex flex-col gap-0">
                    <h2 className="text-[16px] font-bold text-neutral-700 group-hover:text-neutral-900">
                      {department.name}
                    </h2>
                    <p className="flex flex-row items-center gap-1 text-[13px] text-neutral-400">
                      <span className="font-semibold text-neutral-600">
                        {departmentEventsCount
                          ? departmentEventsCount[department._id]
                          : 0}{" "}
                        Events •
                      </span>
                      <span className=" text-[11px] font-normal text-neutral-500">
                        {
                          allUsers.filter(
                            (user) => user.department?._id === department._id,
                          ).length
                        }{" "}
                        members
                      </span>
                    </p>
                  </div>
                  <span className="ml-auto h-6 w-6 rotate-45 rounded-full bg-white p-1 opacity-0 group-hover:opacity-100">
                    <HiArrowNarrowUp />
                  </span>
                </div>
              </>
            );
          })}
        <div>
          {sideBarDepartment && sideBarOpen && (
            <DepartmentDetails
              department={sideBarDepartment}
              events={eventsData?.data?.data}
              closeDetail={() => {
                setSideBarOpen(false);
                setSideBarDepartment(undefined);
              }}
            ></DepartmentDetails>
          )}
        </div>
      </div>
    </div>
  );
}
