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
  }

  return (
    <div className="ml-10 mt-[110px] flex max-w-[40vw] flex-col gap-6">
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
              <textarea
                {...registerLocation("description")}
                className=" h-20 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
              />
            </div>
            <div className="mt-[32px]">
              <span className="font-500 text-[14px]">
                Block <br />
              </span>
              <Select
                value={watchLocationForm("block")}
                onValueChange={(val) => {
                  resetLocationForm({
                    ...getLocationFormValues(),
                    block: val,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="N/A" />
                </SelectTrigger>
                <SelectContent>
                  {blocks?.data?.map((block: { name: string; _id: string }) => (
                    <SelectItem key={block._id} value={block.name}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      <div className="flex flex-row items-center justify-start gap-2">
        <p className="text-[28px] font-semibold text-neutral-700">Locations</p>
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
        {/* )} */}
      </div>
      <div className="flex w-full flex-col gap-5">
        <div className=" w-28">
          <Select onValueChange={(val) => {}}>
            <SelectTrigger>
              <SelectValue placeholder="All Blocks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blocks</SelectItem>
              {blocks?.data?.map((block: { name: string; _id: string }) => (
                <SelectItem key={block._id} value={block.name}>
                  {block.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start justify-start">
          {locations?.data?.length === 0 ? (
            <div className="w-full text-center text-neutral-400">
              No locations added.
            </div>
          ) : (
            locations?.data?.map((location: { name: string; _id: string }) => {
              return (
                <>
                  <div className="flex w-full flex-row items-center justify-between rounded-[4px] bg-white px-5 py-3 shadow-md">
                    <p className="text-[16px] font-semibold text-neutral-700">
                      {location.name}
                    </p>
                    <div className="flex flex-row items-center gap-2">
                      <button
                        onClick={() => {}}
                        className="flex items-center gap-2 rounded-[4px] bg-primary-600 px-3 py-1.5 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-primary-700"
                      >
                        <BiPencil />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
