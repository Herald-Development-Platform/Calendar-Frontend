"use client";
import Endpoints from "@/services/API_ENDPOINTS";
import { Axios } from "@/services/baseUrl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineUsers, HiArrowNarrowUp } from "react-icons/hi";
import { GrLocationPin } from "react-icons/gr";

import { IoMdArrowBack } from "react-icons/io";
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
// import Headers form "@/components/ui/dialog"
import * as Headers from "@/components/Header";

import { profile } from "console";
import { ROLES } from "@/constants/role";
import { PERMISSIONS } from "@/constants/permissions";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function LocationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showAddLocation, setShowAddLocation] = useState(false);

  const { data: locations, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data } = await Axios.get(Endpoints.location);
      return data;
    },
  });

  const { data: blocks } = useQuery({
    queryKey: ["blocks"],
    queryFn: async () => {
      const { data } = await Axios.get(Endpoints.block);
      return data;
    },
  });

  const { userData } = useContext(Context);

  const {
    register: registerLocation,
    handleSubmit: handleLocationSubmit,
    reset: resetLocationForm,
    getValues: getLocationFormValues,
    watch: watchLocationForm,
    formState: { errors },
  } = useForm<{
    name: string;
    block: string;
    description: string;
  }>();

  const onLocationAdd = async (data: any) => {
    try {
      await Axios.post(Endpoints.location, data);
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location added successfully.");
      setShowAddLocation(false);
      resetLocationForm();
    } catch (error) {
      toast.error("Failed to add location.");
    }
  };

  return (
    <>
      <Headers.GeneralHeader />
      <div className="ml-10 flex min-w-[470px] max-w-[40vw] flex-col gap-6">
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
            Locations
          </p>
          {/* {userData?.permissions.includes(PERMISSIONS.CREATE_DEPARTMENT) && ( */}
          <button
            onClick={() => {
              setShowAddLocation(true);
            }}
            className="ml-7 flex items-center gap-2 rounded-[4px] bg-primary-600 px-3 py-1.5 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-primary-700"
          >
            <FaPlus />
            <span>Add Location</span>
          </button>
        </div>
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col items-start justify-start gap-5">
            {locations?.data?.length === 0 ? (
              <div className="w-full text-center">No locations added.</div>
            ) : (
              locations?.data?.map(
                (location: {
                  name: string;
                  block: string;
                  description: string;
                  _id: string;
                }) => {
                  return (
                    <>
                      <div className="flex w-full flex-row items-center gap-2 rounded-[4px] bg-neutral-100 px-3 py-1.5">
                        <span className="text-2xl text-neutral-600">
                          <GrLocationPin />
                        </span>
                        <div className="flex flex-col items-start justify-center gap-1">
                          <span className="text-[16px] font-semibold text-neutral-700">
                            {location.name}
                          </span>
                          {location?.block && (
                            <span className="text-[13px] font-normal text-neutral-400">
                              {location.block}
                            </span>
                          )}
                          {location?.description && (
                            <span className="text-[13px] font-normal text-neutral-400">
                              {location.description}
                            </span>
                          )}
                        </div>
                        <span
                          className="ml-auto cursor-pointer text-danger-400"
                          onClick={async () => {
                            await Axios.delete(
                              `${Endpoints.location}/${location._id}`,
                            );
                            queryClient.invalidateQueries({
                              queryKey: ["locations"],
                            });
                          }}
                        >
                          <RiDeleteBin6Line />
                        </span>
                      </div>
                    </>
                  );
                },
              )
            )}
          </div>
        </div>
      </div>
      <Dialog open={showAddLocation} onOpenChange={setShowAddLocation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[19px] font-semibold ">
              Add Location
            </DialogTitle>
          </DialogHeader>
          <form className="py-2">
            <label htmlFor="add-title">
              <div className="group flex h-11 w-full items-center gap-2  border-b-[1px] border-neutral-300 px-4 focus-within:border-primary-600">
                <span className="text-xl">
                  <GrLocationPin />
                </span>
                <input
                  type="text"
                  placeholder="Add Location"
                  className="w-full text-lg font-normal text-neutral-900 outline-none"
                  {...registerLocation("name", { required: true })}
                />
              </div>
            </label>
            <div className="mt-[32px]">
              <span className="font-500 text-[14px]">
                Short Description <br />
              </span>
              <input
                {...registerLocation("description")}
                className=" w-full rounded border-[1px] border-neutral-300 px-2 py-2 text-neutral-900 focus:border-primary-600"
              />
            </div>
          </form>
          <DialogFooter className=" flex flex-row items-center justify-end py-4">
            <button
              onClick={() => {
                handleLocationSubmit(onLocationAdd)();
              }}
              className="btn btn-md h-5 border-none bg-primary-600 text-sm font-medium text-primary-50 hover:bg-primary-700"
            >
              Create
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
