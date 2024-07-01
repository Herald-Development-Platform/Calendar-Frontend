"use client";
import Endpoints from "@/services/API_ENDPOINTS";
import { Axios } from "@/services/baseUrl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineUsers, HiArrowNarrowUp } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import DepartmentDetails from "./DepartmentDetails";
import { FaPlus } from "react-icons/fa6";
const { useRouter } = require("next/navigation");
import { postDepartment } from "@/services/api/departments";
import { useForm } from "react-hook-form";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { BiPencil } from "react-icons/bi";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { profile } from "console";
import { ROLES } from "@/constants/role";
import { useGetEvents } from "@/services/api/eventsApi";

export default function ManageDepartment() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { userData } = useContext(Context);

  const { data: eventsData } = useGetEvents();

  const { data: departments, isLoading: departmentLoading } = useQuery({
    queryKey: ["Departments"],
    queryFn: async () => {
      let response = await Axios.get(Endpoints.department);
      if (response?.data?.success) {
        return response?.data?.data as Department[];
      } else {
        toast.error("Failed to fetch departments");
        return [] as Department[];
      }
    },
  });

  const [sideBarDepartment, setSideBarDepartment] = useState<Department>();
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);

  let departmentEventsCount: any = {};

  if (eventsData && departments && departments.length > 0) {
    let idOnlyEvents = eventsData?.map((e: any) => {
      let newEvent = { ...e };
      newEvent.departments = newEvent?.departments?.map((d: any) => d._id);
      return newEvent;
    });
    console.log("idOnlyEvents", idOnlyEvents);
    let eventsCountMap: any = {};
    let today = new Date();
    today = new Date(today.setHours(0, 0, 0));
    departments.forEach((department) => {
      let eventsForDepartment = idOnlyEvents.filter(
        (e: any) =>
          e?.departments?.includes(department._id) &&
          new Date(e.start) > today &&
          new Date(e.end) < new Date(Date.now() + 30 * 86400000),
      );
      eventsCountMap[department._id] = eventsForDepartment.length;
    });
    departmentEventsCount = eventsCountMap || {};
  }

  const {
    register: registerDepartment,
    handleSubmit: handleDepartmentSubmit,
    formState: { errors: departmentFormError },
    reset: resetDepartmentForm,
  } = useForm({
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });
  const onDepartmentSubmit = async (data: any) => {
    const response = await postDepartment(data);
    if (response.status >= 400 && response.status < 500) {
      toast.error(
        response?.data?.message ||
          response?.data?.error ||
          "Error process request!",
      );
      return;
    } else {
      toast.success("Department created successfully");
      queryClient.invalidateQueries({ queryKey: ["Departments"] });
      resetDepartmentForm();
    }
  };

  return (
    <div className="ml-10 mt-[110px] flex max-w-[40vw] flex-col gap-6">
      <div className="flex flex-row items-center justify-start gap-2">
        <span
          onClick={() => {
            router.back();
          }}
          className="cursor-pointer text-4xl font-bold text-neutral-600"
        >
          <IoMdArrowBack />
        </span>
        <p className="text-[28px] font-semibold text-neutral-700">
          Manage Department
        </p>
        {userData?.role === ROLES.SUPER_ADMIN && (
          <button
            onClick={() => {
              setDepartmentDialogOpen(true);
            }}
            className="ml-7 flex items-center gap-2 rounded-[4px] bg-primary-600 px-3 py-1.5 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-primary-700"
          >
            <FaPlus />
            <span>Add Department</span>
          </button>
        )}
      </div>
      <div className="flex w-full flex-col gap-5">
        {departments &&
          departments.length &&
          departments.length > 0 &&
          departments.map((department: Department) => {
            return (
              <>
                <div
                  onClick={() => {
                    setSideBarDepartment(department);
                    setSideBarOpen(true);
                    console.log("Department selected: ", department);
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
                        {department.membersCount} members
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
          {sideBarDepartment && sideBarOpen && eventsData && (
            <DepartmentDetails
              department={sideBarDepartment}
              events={eventsData}
              closeDetail={() => {
                setSideBarOpen(false);
                setSideBarDepartment(undefined);
              }}
              invalidationFunction={() => {
                console.log("Invalidating");
                setSideBarOpen(false);
                setSideBarDepartment(undefined);
                queryClient.invalidateQueries({ queryKey: ["Departments"] });
              }}
            ></DepartmentDetails>
          )}
        </div>
      </div>
      <Dialog
        open={departmentDialogOpen}
        onOpenChange={setDepartmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[19px] font-semibold ">
              Add Department
            </DialogTitle>
          </DialogHeader>
          <form
            className="py-2"
            onSubmit={handleDepartmentSubmit(onDepartmentSubmit)}
          >
            <label htmlFor="add-title">
              <div className="group flex h-11 w-full items-center gap-2  border-b-[1px] border-neutral-300 px-4 focus-within:border-primary-600">
                <span className="text-xl">
                  <BiPencil />
                </span>
                <input
                  type="text"
                  placeholder="Department Code"
                  className="w-full text-lg font-normal text-neutral-900 outline-none"
                  {...registerDepartment("code", {
                    required: "Code is required",
                  })}
                />
              </div>
            </label>
            <div className="mt-[32px]">
              <span className="font-500 text-[14px]">
                Department Name <br />
              </span>
              <input
                type="text"
                className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
                {...registerDepartment("name", {
                  required: "Name is required",
                })}
              />
            </div>
            <div className="mt-[32px]">
              <span className="font-500 text-[14px]">
                Description <br />
              </span>
              <textarea
                className=" h-20 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
                {...registerDepartment("description", {
                  required: "Description is required",
                })}
              />
            </div>
          </form>
          <DialogFooter className=" flex flex-row items-center justify-end py-4">
            <button
              onClick={() => {
                handleDepartmentSubmit(onDepartmentSubmit)();
                setDepartmentDialogOpen(false);
              }}
              className="btn btn-md h-5 border-none bg-primary-600 text-sm font-medium text-primary-50 hover:bg-primary-700"
            >
              Create
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
