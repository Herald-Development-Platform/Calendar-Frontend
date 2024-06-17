import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import EventCard from "@/components/UpcommingEvents/EventCard";

export default function DepartmentDetails({
  department,
  events,
  closeDetail
}: {
  department: Department;
  events: eventType[];
  closeDetail: () => void;
}) {
  return (
    <section
      className={` absolute right-0 top-[15%] flex h-auto max-h-[80vh] w-80 flex-col  gap-6 overflow-y-scroll p-6 font-medium text-neutral-600 transition-all duration-150`}
    >
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
          <button className="cursor-pointer text-base">
            <BsThreeDotsVertical />
          </button>
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
              if (!event.departments.map((d:any) => d?._id).includes(department._id)){
                return null;
              }
              return (
                <div className=" my-1">
                  <EventCard event={event} key={event._id} />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
