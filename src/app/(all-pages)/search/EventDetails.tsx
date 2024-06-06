import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import EventCard from "@/components/UpcommingEvents/EventCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import colors from "@/constants/Colors";

export default function EventDetails({
  selectedEvent,
}: {
  selectedEvent: eventType | null;
}) {
  return (
    <section className="absolute right-0 top-0 flex h-auto w-80 flex-col gap-6    p-6 font-semibold text-neutral-600">
      <div className="font flex items-center">
        <span className="text-base">Event Details</span>
        <span className="ml-auto flex gap-[6px] text-black">
          <button className="cursor-pointer text-base">
            <BsThreeDotsVertical />
          </button>
          <button className="cursor-pointer text-xl">
            <RxCross2 />
          </button>
        </span>
      </div>
      <div>
        <div className="relative flex h-5 w-full items-center">
          <div className="w-full "></div>
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white px-2 text-sm text-neutral-600">
            August 18
          </h1>
        </div>
        {selectedEvent && <EventCard event={selectedEvent} />}
      </div>

      <div>
        <p>Priority</p>
        <Select>
          <SelectTrigger className="w-[180px]">
            <div>lasdlksdjaf</div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Colors</SelectLabel>
              {colors.map((color) => (
                <SelectItem value={color} key={color}>
                  {color}
                </SelectItem>
              ))}
              {/* <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem> */}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
