import {
  useCreateEventMutation,
  useEditEventMutation,
  useUpdateEvents,
} from "@/services/api/eventsApi";
import React, { use, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPencil } from "react-icons/bi";
import { Textarea } from "../ui/textarea";
import InviteMembers from "./InviteMembers";
import DatePicker from "./DatePicker";
import colors from "@/constants/Colors";
import { RecurringEventTypes } from "@/constants/RecurringEvents";
import { makePascalCase } from "@/lib/utils";
import DepartmentButton from "../DepartmentButton";
import { useGetDepartments } from "@/services/api/departments";
import { set } from "date-fns";
import { LocationSelect } from "./LocationSelect";
import TimePicker from "./TimePicker";
import { Context } from "@/app/clientWrappers/ContextProvider";
import CustomTimePicker from "./CustomTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import "./EventForm.css";

const EventForm = ({
  type,
}: {
  type: string;
}) => {
  const [dateType, setDateType] = useState<"single" | "multi">("single");

  const { data: departmentsRes } = useGetDepartments();
  const { userData, setOpenDialog } = useContext(Context);
  const queryClient = useQueryClient();

  // console.log("EVENT FORM RENDERERED")
  const { selectedDate, selectedEventData } = useContext(Context);

  const isEdit = selectedEventData ? true : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<eventType>({
    defaultValues: {
      title: "",
      start: selectedDate?.start || new Date(),
      end: selectedDate?.end
        ? new Date(selectedDate?.end.getTime() - 1000 * 60 * 60 * 24)
        : new Date(),
      color: colors.find((color) => color?.priority === "Informational")?.color,
      duration: 0,
      location: "",
      description: undefined,
      departments: [],
      notes: "",
      recurringType: RecurringEventTypes.ONCE,
      involvedUsers: [],
      recurrenceEnd: null,
    },
  });

  const { mutate: postNewEvent, isPending: Posting } = useCreateEventMutation();
  const { mutate: updateEvent, isPending: Updating } = useEditEventMutation();

  // const [newEvent, setNewEvent] = useState<eventType>({
  //   title: "",
  //   start: new Date(),
  //   end: null,
  //   color: colors.find((color) => color?.priority === "Informational")?.color,
  //   duration: 0,
  //   location: "",
  //   description: undefined,
  //   departments: [],
  //   notes: "",
  //   recurringType: RecurringEventTypes.ONCE,
  //   involvedUsers: [],
  //   recurrenceEnd: null,
  // });

  useEffect(() => {
    console.log("selectedEventData", selectedEventData);
    if (selectedEventData) {
      reset({
        title: selectedEventData?.title,
        start: selectedEventData?.start,
        end: selectedEventData?.end,
        color: selectedEventData?.color,
        duration: selectedEventData?.duration,
        location: selectedEventData?.location,
        description: selectedEventData?.description,
        departments: selectedEventData?.departments,
        notes: selectedEventData?.notes,
        recurringType: selectedEventData?.recurringType,
        involvedUsers: selectedEventData?.involvedUsers,
        recurrenceEnd: selectedEventData?.recurrenceEnd,
      });
    }

    console.log(selectedEventData);
  }, [selectedEventData]);

  const handleValueChange = (e: any) => {
    let { name, value } = e.target;
    if (!name) {
      name = e.currentTarget.name;
      value = e.currentTarget.value;
    }

    console.log(name, value);

    switch (name) {
      case "department":
        if (userData?.department?._id === value) return;
        let departments = watch("departments");
        if (departments?.includes(value)) {
          setValue("departments", [
            ...departments?.filter((item) => item !== value),
          ]);
        } else {
          let updatedDepartments = [...departments, value];
          let departmentSet = new Set(updatedDepartments);
          updatedDepartments = Array.from(departmentSet);
          setValue("departments", updatedDepartments);
        }
        break;

      case "addMember": {
        const userId = value;
        const involvedUsers = watch("involvedUsers");
        if (involvedUsers?.includes(userId)) return;

        setValue("involvedUsers", [...involvedUsers, userId]);
        break;
      }
      case "removeMember": {
        const userId = value;

        setValue("involvedUsers", [
          ...watch("involvedUsers").filter((memberId) => memberId !== userId),
        ]);
        break;
      }
      default:
        setValue(name, value);
        break;
    }
  };

  useEffect(() => {
    console.log("departments", watch("departments"));
  }, [watch("departments")]);

  useEffect(() => {
    let currentDepartments: string[] = [];
    if (userData?.department) {
      currentDepartments = [userData?.department?._id].concat(
        watch("departments") ?? [],
      );
      currentDepartments = Array.from(new Set(currentDepartments));
      // setNewEvent((prev) => ({ ...prev, departments: currentDepartments }));
    }

    setValue("departments", currentDepartments);
  }, [userData]);

  useEffect(() => {
    const start = watch("start");
    const end = watch("end");

    setDateType(
      start && new Date(start).getDate() !== new Date(end ?? "").getDate()
        ? "multi"
        : "single",
    );
  }, [selectedDate]);

  const onSubmit = (data: eventType) => {
    console.log(data);

    if (!data.start || !data.end) {
      toast.error("Start date and end date must be valid.");
      return;
    }


    if(data.recurrenceEnd){
      if(new Date(data.recurrenceEnd).getTime() < new Date(data.start).getTime()){
        toast.error("Recurrence end date cannot be earlier than start date");
        return;
      }
    }
    

    const startDate = new Date(data.start);
    const endDate = new Date(data.end);

    if (startDate.getTime() >= endDate.getTime()) {
      toast.error("End date/time cannot be earlier than start date/time");
      return;
    }
    if (!isEdit) {
      postNewEvent(data, {
        onSuccess: () => {
          // toast.success("Event created successfully");
          queryClient.invalidateQueries({ queryKey: ["Events"] });
          reset();
          setOpenDialog(false);
        },
        onError: (error) => {
          toast.error("Error creating event");
        },
      });
    } else {
      const updateData = {
        ...selectedEventData,
        ...data,
      };

      console.log("update", data);
      updateEvent(updateData, {
        onSuccess: () => {
          toast.success("Event updated successfully");
          queryClient.invalidateQueries({ queryKey: ["Events"] });
          // reset();
          setOpenDialog(false);
        },
        onError: (error) => {
          toast.error("Error updating event");
        },
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <label htmlFor="add-title">
          <div className="group flex h-11 w-full items-center gap-2  border-b-[2px] border-neutral-300 px-4 focus-within:border-primary-600">
            <span className="text-xl">
              <BiPencil />
            </span>
            <input
              type="text"
              className="w-full text-lg font-normal text-neutral-900 outline-none"
              placeholder={`${type} Title`}
              id="add-title"
              {...register("title", { required: "Title is required" })}
            />
          </div>
          {errors.title && (
            <span className="form-validation-msg text-sm text-danger-700">
              {errors.title?.message}
            </span>
          )}
        </label>

        {/* Description section  */}
        <div className="w-full text-sm">
          Description <br />
          <Textarea
            placeholder="Type your message here."
            className="w-full text-neutral-900 ring-ring focus:border-primary-600  focus-visible:ring-0"
            id="message"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <span className="form-validation-msg text-sm text-danger-700">
              {errors?.description?.message}
            </span>
          )}
        </div>

        {/* Date Input section */}
        <label htmlFor="date" className="flex flex-col gap-2 text-sm ">
          <div className="flex gap-3">
            <button
              type="button"
              tabIndex={0}
              name="end"
              onClick={(e) => {
                setDateType("single");
                handleValueChange({
                  target: { name: "end", value: watch("start") },
                });
              }}
              className={`${
                dateType === "single" ? "underline" : ""
              } cursor-pointer  underline-offset-4`}
            >
              Date
            </button>
            <button
              type="button"
              tabIndex={0}
              onClick={() => setDateType("multi")}
              className={`${
                dateType === "multi" ? "underline" : ""
              }  cursor-pointer underline-offset-4`}
            >
              Multi Date
            </button>
          </div>

          {dateType === "single" ? (
            <DatePicker
              value={watch("start")}
              handleValueChange={({ target: { name, value } }) => {
                let newStart;
                let newEnd;

                const startValue = watch("start");
                const endValue = watch("end");

                if (startValue) {
                  let oldHours = new Date(startValue).getHours();
                  let oldMinutes = new Date(startValue).getMinutes();
                  newStart = new Date(
                    new Date(value).setHours(oldHours, oldMinutes),
                  );
                } else {
                  newStart = new Date(value);
                }

                if (endValue) {
                  let oldHours = new Date(endValue).getHours();
                  let oldMinutes = new Date(endValue).getMinutes();
                  newEnd = new Date(
                    new Date(value).setHours(oldHours, oldMinutes),
                  );
                } else {
                  newEnd = new Date(
                    new Date(value).setHours(new Date(value).getHours() + 1),
                  );
                }

                handleValueChange({
                  target: { name: "start", value: newStart },
                });
                handleValueChange({
                  target: { name: "end", value: newEnd },
                });
              }}
              name={"start"}
            />
          ) : (
            <div className="flex w-full flex-row items-center gap-2 ">
              <DatePicker
                value={watch("start")}
                handleValueChange={({ target: { name, value } }) => {
                  let newStart;
                  newStart = watch("start");

                  if (newStart) {
                    let oldHours = new Date(newStart).getHours();
                    let oldMinutes = new Date(newStart).getMinutes();
                    newStart = new Date(
                      new Date(value).setHours(oldHours, oldMinutes),
                    );
                  } else {
                    newStart = new Date(
                      new Date(value).setHours(new Date(value).getHours() + 1),
                    );
                  }

                  handleValueChange({
                    target: { name: "start", value: newStart },
                  });
                }}
                name={"start"}
              />
              <span className="text-neutral-600">-</span>
              <DatePicker
                value={watch("end")}
                name={"end"}
                handleValueChange={({ target: { name, value } }) => {
                  let newEnd;
                  newEnd = watch("end");

                  if (newEnd) {
                    let oldHours = new Date(newEnd).getHours();
                    let oldMinutes = new Date(newEnd).getMinutes();
                    newEnd = new Date(
                      new Date(value).setHours(oldHours, oldMinutes),
                    );
                  } else {
                    newEnd = new Date(value);
                  }

                  handleValueChange({
                    target: { name: "end", value: newEnd },
                  });
                }}
              />
            </div>
          )}

          {/* Recurrence  */}
          <div className="flex gap-[14px]">
            {(
              Object.keys(RecurringEventTypes) as Array<
                keyof typeof RecurringEventTypes
              >
            ).map((eventKey, i) => {
              console.log(`eventKey for ${i}`, eventKey);
              return (
                <label
                  className="flex cursor-pointer items-center gap-[7px] text-sm font-medium text-neutral-500"
                  // htmlFor={t}
                  key={i}
                >
                  <input
                    checked={
                      RecurringEventTypes[eventKey] === watch("recurringType")
                    }
                    // id={eventKey}
                    type="checkbox"
                    name={"recurringType"}
                    value={RecurringEventTypes[eventKey]}
                    onClick={handleValueChange}
                  />
                  <span>{makePascalCase(eventKey)}</span>
                </label>
              );
            })}
          </div>
        </label>

        {watch("recurringType") !== "NONE" && (
          <div className="w-full text-sm">
            <span>Recurrence End Date:</span>
            <DatePicker
              name={"recurrenceEnd"}
              value={watch("recurrenceEnd")}
              handleValueChange={handleValueChange}
            />
          </div>
        )}

        <div className="flex w-full gap-4">
          <CustomTimePicker
            type="start"
            value={watch("start")}
            handleTimeChange={handleValueChange}
          />
          <CustomTimePicker
            type="end"
            value={watch("end")}
            handleTimeChange={handleValueChange}
          />
        </div>

        {/* Color input section  */}
        <div className=" flex flex-col items-start">
          <span className="text-sm">Priority</span>
          <div key={"AddEventPriority"} className="flex gap-2">
            {colors?.map((Color, i) => (
              <label
                className={`fc-custom-semester-dot-event btn checkbox btn-xs relative h-7 w-7 cursor-pointer rounded-none border-none`}
                style={{ backgroundColor: Color.color }}
                htmlFor={`ColorInput_${i}`}
                key={i}
              >
                <input
                  type="checkbox"
                  className={
                    Color.color == watch("color")
                      ? "absolute h-full w-full border-none text-white"
                      : "absolute hidden h-full w-full border-none text-white"
                  }
                  style={{
                    accentColor: Color.color,
                  }}
                  checked={Color.color == watch("color")}
                  readOnly
                />
                <input
                  name="color"
                  id={`ColorInput_${i}`}
                  type="radio"
                  className="absolute hidden"
                  value={Color.color}
                  onClick={handleValueChange}
                />
                <div className="semester-tooltip-wrapper-event">
                  <div
                    className="semester-tooltip-data"
                    style={{
                      color: Color.color,
                    }}
                  >
                    {Color.priority}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors?.color && (
            <span className="form-validation-msg text-sm text-danger-700">
              {errors?.color.message}
            </span>
          )}
        </div>

        <LocationSelect
          value={watch("location") as string}
          handleValueChange={handleValueChange}
        />

        {/* Departments section  */}
        <div className="text-sm">
          <span>Departments:</span>
          <div className="my-2 flex flex-wrap items-center gap-1">
            {Array.isArray(departmentsRes) && (
              <DepartmentButton
                selectedCross={false}
                onClick={() => {
                  if (watch("departments")?.length === departmentsRes?.length) {
                    if (userData?.department?._id) {
                      setValue("departments", [userData?.department?._id]);
                    } else {
                      setValue("departments", []);
                    }
                  } else {
                    setValue(
                      "departments",
                      departmentsRes?.map(
                        (department: Department) => department._id,
                      ),
                    );
                  }
                }}
                id={"All"}
                value={"All"}
                selected={
                  watch("departments")?.length === departmentsRes.length
                }
              />
            )}

            {Array.isArray(departmentsRes) &&
              departmentsRes?.map((department: Department) => {
                const departmentExists = watch("departments")?.includes(
                  department._id,
                );
                return (
                  <DepartmentButton
                    selectedCross={false}
                    key={department._id}
                    id={department._id}
                    onClick={handleValueChange}
                    value={department.code}
                    selected={departmentExists}
                  />
                );
              })}
          </div>
          {errors?.departments && (
            <span className="form-validation-msg text-sm text-danger-700">
              {errors?.departments.message}
            </span>
          )}
        </div>

        {/* Invite Members */}
        <InviteMembers
          memberIds={watch("involvedUsers")}
          handleInviteMembers={handleValueChange}
        ></InviteMembers>

        {/* Notes section  */}
        <div className="text-sm">
          <span>Notes</span> <br />
          <input
            type="text"
            className=" h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-sm text-neutral-900 focus:border-primary-600"
            {...register("notes", { required: "Notes is required" })}
          />
        </div>

        {/* create btn  */}
        <div
          // method="dialog"
          className=" flex h-16 w-full items-center justify-end "
        >
          {/* create btn  */}
          <div className="flex w-full items-center justify-end gap-5">
            <button className="flex gap-2 rounded-md border-none bg-primary-600 px-4 py-2 text-base font-medium text-primary-50 hover:bg-primary-700">
              {!isEdit ? "Create" : "Edit"}
              {(Posting || Updating) && (
                <LoaderCircle className="animate-spin" />
              )}
            </button>
          </div>
        </div>
      </form>
    </LocalizationProvider>
  );
};

export default EventForm;
