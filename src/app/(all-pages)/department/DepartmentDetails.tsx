import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import EventCard from "@/components/UpcommingEvents/EventCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMutation } from "@tanstack/react-query";
import { Axios } from "@/services/baseUrl";
import Endpoints from "@/services/API_ENDPOINTS";
import toast from "react-hot-toast";
import { BiPencil } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { PERMISSIONS } from "@/constants/permissions";

export default function DepartmentDetails({
  department,
  events,
  closeDetail,
  invalidationFunction,
}: {
  department: Department;
  events: eventType[];
  closeDetail: () => void;
  invalidationFunction?: () => void;
}) {
  const [editDepartmentModalOpen, setEditDepartmentModalOpen] = useState(false);
  const [deleteDepartmentModalOpen, setDeleteDepartmentModalOpen] =
    useState(false);
  const [mutateDepartment, setMutateDepartment] = useState<Department>();

  const { mutate: deleteDepartment, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) =>
      Axios.delete(Endpoints.departmentById(id)),
    onSuccess: () => {
      invalidationFunction && invalidationFunction();
    },
  });

  const { mutate: updateDepartment, isPending: isUpdatingDepartment } =
    useMutation({
      mutationFn: async (data: Department) =>
        Axios.put(Endpoints.departmentById(data._id), data),
      onSuccess: (response) => {
        console.log("Response: ", response);
        if (response.status >= 400 && response.status < 500) {
          toast.error(
            response?.data?.message ||
              response?.data?.error ||
              "Error process request!",
          );
          return;
        } else {
          toast.success("Department updated successfully");
          resetDepartmentForm();
        }
        setEditDepartmentModalOpen(false);
        setMutateDepartment(undefined);
        invalidationFunction && invalidationFunction();
      },
    });

  const { userData } = useContext(Context);

  const {
    register: registerDepartment,
    handleSubmit: handleDepartmentSubmit,
    formState: { errors: departmentFormError },
    reset: resetDepartmentForm,
  } = useForm({
    defaultValues: {
      _id: mutateDepartment?._id,
      code: mutateDepartment?.code,
      name: mutateDepartment?.name,
      description: mutateDepartment?.description,
    },
  });

  useEffect(() => {
    resetDepartmentForm({
      code: mutateDepartment?.code,
      name: mutateDepartment?.name,
      description: mutateDepartment?.description,
      _id: mutateDepartment?._id,
    });
  }, [mutateDepartment]);

  const onDepartmentSubmit = async (data: any) => {
    updateDepartment(data);
  };

  return (
    <section
      className={` absolute right-0 top-[15%] flex h-auto max-h-[80vh] w-80 flex-col  gap-6 overflow-y-scroll p-6 font-medium text-neutral-600 transition-all duration-150`}
    >
      {/* Update department dialog */}
      <Dialog
        open={editDepartmentModalOpen}
        onOpenChange={(open) => {
          setEditDepartmentModalOpen(open);
          setMutateDepartment(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" text-[19px] font-semibold ">
              Edit department details
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
              }}
              className="btn btn-md h-5 border-none bg-primary-600 text-base font-medium text-primary-50 hover:bg-primary-700"
            >
              Update
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete department dialog */}
      <Dialog
        open={deleteDepartmentModalOpen}
        onOpenChange={(open) => {
          setDeleteDepartmentModalOpen(open);
          setMutateDepartment(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" text-[19px] font-semibold ">
              Delete Department?
            </DialogTitle>
          </DialogHeader>
          <div>
            <p>
              You sure to delete the department{" "}
              <strong>{mutateDepartment?.name}</strong>
            </p>
            <p>
              All the department members will be updated to choose their
              department
            </p>
          </div>
          <DialogFooter className=" flex flex-row items-center justify-end py-4">
            <button
              onClick={() => {
                if (mutateDepartment?._id) {
                  deleteDepartment(mutateDepartment?._id);
                  toast.success("Department deleted successfully");
                }
                invalidationFunction && invalidationFunction();
                setDeleteDepartmentModalOpen(false);
              }}
              className="text-xsm btn btn-md border-none bg-red-400 text-[14px] font-medium text-primary-50 hover:bg-red-700"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="font flex items-center transition">
        <div className="flex flex-col items-start justify-start">
          <span className=" text-[16px] font-semibold text-neutral-600">
            {department?.name}
          </span>
          <span className=" text-[13px] text-neutral-400">
            {department?.code}
          </span>
        </div>
        <span className="ml-auto flex items-center gap-[6px] text-black">
          <span className="ml-auto flex items-center gap-[6px] text-black">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="cursor-pointer text-base">
                  <BsThreeDotsVertical />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] px-5 py-4 text-sm font-semibold">
                {userData &&
                  userData?.permissions?.includes(
                    PERMISSIONS.UPDATE_DEPARTMENT,
                  ) && (
                    <button
                      onClick={(e: any) => {
                        setMutateDepartment(department);
                        setEditDepartmentModalOpen(true);
                      }}
                      className="flex w-full items-center justify-start gap-2 px-2 py-1 text-neutral-700 transition-colors duration-150 hover:bg-neutral-100  hover:text-neutral-800"
                    >
                      <span className="text-2xl">
                        <MdOutlineModeEditOutline />
                      </span>
                      Edit Department
                    </button>
                  )}

                {userData &&
                  userData?.permissions?.includes(
                    PERMISSIONS.DELETE_DEPARTMENT,
                  ) && (
                    <>
                      <DropdownMenuSeparator />
                      <button
                        onClick={() => {
                          setMutateDepartment(department);
                          setDeleteDepartmentModalOpen(true);
                        }}
                        className="flex w-full items-center justify-start gap-2 px-2 py-1 text-danger-400 transition-colors duration-150 hover:bg-neutral-100  hover:text-danger-500"
                      >
                        <span className="text-2xl">
                          <RiDeleteBin6Line />
                        </span>
                        Delete Department
                      </button>
                    </>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
          <button onClick={closeDetail} className="cursor-pointer text-xl">
            <RxCross2 />
          </button>
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <p className=" font-500 text-[16px] text-neutral-600">Description</p>
        <p className=" text-[16px] text-neutral-500">
          {department.description}
        </p>
      </div>
      <div className=" flex flex-col gap-2 ">
        <p className=" text-[16px] font-semibold text-neutral-600 ">Events</p>
        <div className=" flex flex-col ">
          {events &&
            events.map((event) => {
              console.log("Event: ", event);
              if (
                !event.departments
                  .map((d: any) => d?._id)
                  .includes(department._id)
              ) {
                return null;
              }
              return (
                <div className=" my-1" key={event._id}>
                  <EventCard event={event} />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
