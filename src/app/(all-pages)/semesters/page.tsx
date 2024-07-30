"use client";
import DatePicker from "@/components/AddEventModal/DatePicker";
import { SketchPicker } from "react-color";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as Headers from "@/components/Header";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import {
  useCreateSemesters,
  useDeleteSemester,
  useGetSemesters,
  useUpdateSemester,
} from "@/services/api/semesters";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";
import { useQueryClient } from "@tanstack/react-query";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { PERMISSIONS } from "@/constants/permissions";

export default function SemestersPage() {
  const router = useRouter();
  const [semesterDialogOpen, setSemesterDialogOpen] = useState(false);
  const [currentMutation, setCurrentMutation] = useState("create");

  const {
    handleSubmit: handleSubmitSemester,
    reset: resetSemester,
    getValues: getValuesSemester,
    watch: watchSemester,
  } = useForm<Semester>();
  const { userData: profile } = useContext(Context);

  const queryClient = useQueryClient();

  const { mutate: createSemester } = useCreateSemesters(() => {
    setSemesterDialogOpen(false);
    queryClient.invalidateQueries({
      queryKey: ["semesters"],
    });
    toast.success("Semester added successfully");
  });
  const { mutate: updateSemester, isPending: isUpdatingSemester } =
    useUpdateSemester({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["semesters"],
        });
        setSemesterDialogOpen(false);
        toast.success("Semester updated successfully");
      },
    });

  const { mutate: deleteSemester } = useDeleteSemester({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["semesters"],
      });
      toast.success("Semester deleted successfully");
    },
  });

  const { data: semesters, isLoading } = useGetSemesters();

  return (
    <>
      <Headers.GeneralHeader />
      <div className="ml-10 flex max-w-[40vw] flex-col gap-7 pb-3">
        <Dialog open={semesterDialogOpen} onOpenChange={setSemesterDialogOpen}>
          <DialogContent>
            <form
              onSubmit={handleSubmitSemester(function (data) {
                if (currentMutation === "create") {
                  return createSemester(data);
                }
                return updateSemester(data);
              })}
            >
              <h1 className="w-full text-left text-[19px] font-medium text-neutral-900">
                {currentMutation === "create" ? "Add" : "Edit"} Semester
              </h1>
              <div className=" mt-5 flex flex-col gap-8 ">
                <div className=" flex flex-col items-start justify-center gap-2 ">
                  <span className="text-[14px] font-medium text-neutral-600 ">
                    Course
                  </span>
                  <Select
                    value={watchSemester("course")}
                    onValueChange={(value) => {
                      resetSemester({
                        ...getValuesSemester(),
                        course: value,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent className="text-neutral-900">
                      <SelectItem value="BIT">BIT</SelectItem>
                      <SelectItem value="BIBM">BIBM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className=" flex flex-col items-start justify-center gap-2 ">
                  <span className="text-[14px] font-medium text-neutral-600 ">
                    Semester
                  </span>
                  <Select
                    value={watchSemester("semester")}
                    onValueChange={(value) => {
                      resetSemester({
                        ...getValuesSemester(),
                        semester: value,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent className="text-neutral-900">
                      <SelectItem value="Semester 1">Semester 1</SelectItem>
                      <SelectItem value="Semester 2">Semester 2</SelectItem>
                      <SelectItem value="Semester 3">Semester 3</SelectItem>
                      <SelectItem value="Semester 4">Semester 4</SelectItem>
                      <SelectItem value="Semester 5">Semester 5</SelectItem>
                      <SelectItem value="Semester 6">Semester 6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className=" flex flex-col items-start justify-center gap-2 ">
                  <span className="text-[14px] font-medium text-neutral-600 ">
                    Duration
                  </span>
                  <div className="flex w-full items-center justify-between gap-3">
                    <DatePicker
                      align="top"
                      name="start"
                      value={watchSemester("start")}
                      handleValueChange={(e) => {
                        resetSemester({
                          ...getValuesSemester(),
                          start: e.target.value,
                        });
                      }}
                    />
                    <span className=" text-[14px] font-semibold text-neutral-600">
                      To
                    </span>
                    <DatePicker
                      align=" top"
                      name="end"
                      value={watchSemester("end")}
                      handleValueChange={(e) => {
                        resetSemester({
                          ...getValuesSemester(),
                          end: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className=" flex flex-col items-start justify-center gap-2 ">
                  <span className="text-[14px] font-medium text-neutral-600 ">
                    Semester Color
                  </span>
                  <Popover>
                    <PopoverTrigger className="flex w-full items-center justify-start gap-2 rounded-md border border-[#cbd5e1a7] px-3 py-2">
                      {watchSemester("color") === "" ? (
                        <>
                          <div className="h-[32px] w-[32px] rounded-md bg-neutral-200" />
                          <span className="text-[16px] font-normal text-neutral-900">
                            N/A
                          </span>
                        </>
                      ) : (
                        <>
                          <div
                            style={{ backgroundColor: watchSemester("color") }}
                            className="h-[32px] w-[32px] rounded-md"
                          />
                          <span className="text-[16px] font-normal text-neutral-900">
                            {watchSemester("color")}
                          </span>
                        </>
                      )}
                      <span className="text-[13px] font-normal text-neutral-900">
                        (Click to change color)
                      </span>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="border-none bg-transparent shadow-none"
                    >
                      <SketchPicker
                        onChange={(color: any) => {
                          resetSemester({
                            ...getValuesSemester(),
                            color: color.hex.toUpperCase(),
                          });
                        }}
                        color={watchSemester("color")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <button
                type="submit"
                onClick={() => {}}
                className="mt-4 w-full rounded-[4px] bg-primary-600 px-3 py-3 text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-primary-700"
              >
                {currentMutation === "create" ? "Save" : "Update"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
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
            Semesters
          </p>
          {profile &&
            profile.permissions.includes(PERMISSIONS.CREATE_SEMESTER) && (
              <button
                onClick={() => {
                  setCurrentMutation("create");
                  setSemesterDialogOpen(true);
                }}
                className="ml-7 flex items-center gap-2 rounded-[4px] bg-primary-600 px-3 py-1.5 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-primary-700"
              >
                <FaPlus />
                <span>Add Semester Period</span>
              </button>
            )}
        </div>
        <div className="flex max-w-[40vw] flex-col items-start justify-start gap-5">
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              {semesters?.data?.data.map((semester: Semester) => (
                <div
                  key={semester._id}
                  className="flex w-full flex-row items-center justify-start gap-4"
                >
                  <div
                    style={{
                      backgroundColor: semester.color,
                    }}
                    className="h-[45px] w-[45px] rounded-md"
                  />
                  <div className="flex flex-col items-start justify-center gap-0.5">
                    <span className="text-[16px] font-semibold text-neutral-900">
                      {semester.course} - {semester.semester}
                    </span>
                    <span className="text-[14px] font-normal text-neutral-600">
                      {new Date(semester.start).toDateString()} -{" "}
                      {new Date(semester.end).toDateString()}
                    </span>
                  </div>
                  <div className="ml-auto flex h-full items-center justify-center">
                    <Popover>
                      <PopoverTrigger className="text-neutral-600">
                        <BsThreeDotsVertical />
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="flex flex-col gap-2.5 rounded-[8px] px-5 py-4"
                      >
                        {profile &&
                          profile.permissions.includes(
                            PERMISSIONS.UPDATE_SEMESTER,
                          ) && (
                            <div
                              onClick={() => {
                                setCurrentMutation("update");
                                resetSemester({
                                  course: semester.course,
                                  semester: semester.semester,
                                  start: new Date(semester.start),
                                  end: new Date(semester.end),
                                  color: semester.color,
                                  _id: semester._id,
                                });
                                setSemesterDialogOpen(true);
                              }}
                              className="flex cursor-pointer items-center justify-start gap-1.5 px-1.5 text-neutral-700 "
                            >
                              <span className="text-xl">
                                <MdOutlineEdit />
                              </span>
                              <span className="ml-2">Edit Semester</span>
                            </div>
                          )}
                        <hr />
                        {profile &&
                          profile.permissions.includes(
                            PERMISSIONS.DELETE_SEMESTER,
                          ) && (
                            <div
                              onClick={() => {
                                deleteSemester(semester._id ?? "");
                              }}
                              className="flex cursor-pointer items-center justify-start gap-1.5 px-1.5 text-danger-400 "
                            >
                              <span className="text-xl">
                                <LuTrash2 />
                              </span>
                              <span className="ml-2">Delete Semester</span>
                            </div>
                          )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
