import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import { Axios } from "@/services/baseUrl";
import Endpoints from "@/services/API_ENDPOINTS";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrLocationPin } from "react-icons/gr";

export default function Locations({
  handleValueChange,
}: {
  handleValueChange: (e: any) => void;
}) {
  const { data: locations, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await Axios.get(Endpoints.location);
      const resData = res?.data?.data;
      return resData;
    },
  });

  console.log("location", locations);
  return (
    <div className="flex flex-col items-start text-sm">
      <span>Location:</span>

      <select
        name="location"
        onChange={() => {}}
        defaultValue={""}
        id=""
        className="h-10 w-full bg-white px-5"
        onChangeCapture={handleValueChange}
      >
        {locations?.map((locationInfo: any) => {
          <option value="">Choose a location</option>;
          return (
            <>
              <option
                className="h-10 border-none"
                value={locationInfo?.name}
                key={locationInfo?._id}
              >
                {locationInfo?.name}
              </option>
              ;
            </>
          );
        })}
      </select>
    </div>
  );
}
