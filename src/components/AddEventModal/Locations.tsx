import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Axios } from "@/services/baseUrl";
import Endpoints from "@/services/API_ENDPOINTS";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrLocationPin } from "react-icons/gr";
import { useGetLocation } from "@/services/api/locations";
import { Search } from "lucide-react";
import { IoIosSearch } from "react-icons/io";
import { useDebounce } from "@/hooks/useDebounce";
import { FaPlus } from "react-icons/fa6";

export default function Locations({
  value,
  handleValueChange,
}: {
  value: string;
  handleValueChange: (e: any) => void;
}) {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState("");
  const { data: locations, isLoading } = useGetLocation();
  useEffect(() => setFilteredLocations(locations), [isLoading]);

  const [filteredLocations, setFilteredLocations] = useState<
    Location[] | undefined
  >(
    Array.isArray(locations)
      ? [
          // @ts-ignore
          ...locations,
        ]
      : [],
  );

  const applyFilters = (filterQuery: string) => {
    // if (filterQuery === undefined) return;

    const filteredData = locations?.filter((location: Location) => {
      const reg = new RegExp(filterQuery, "ig");
      return reg.test(location?.name);
    });
    setFilteredLocations(filteredData);
  };

  useDebounce({
    dependency: [filterQuery],
    debounceFn: () => applyFilters(filterQuery),
    time: 150,
  });


  return (
    <>
      <div className="relative flex flex-col items-start text-sm">
        <span>Location:</span>
        <input
          type="text"
          className="h-10 w-full rounded-[4px] border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
          name="location"
          value={value}
          onFocus={() => setShowPopup(true)}
          onChange={handleValueChange}
        />
        <div
          className={`${
            showPopup ? "block" : "hidden"
          } absolute right-0 z-20 flex h-[440px] w-[370px] -translate-y-full flex-col gap-[10px] rounded-[4px] border border-neutral-300 bg-white px-4 py-4`}
          style={{ boxShadow: "0px 4px 16px 4px #00000014" }}
        >
          <div className="green-scrollbar flex-grow space-y-[8px] overflow-y-auto">
            {filteredLocations?.length === 0 ? (
              <div className="w-full text-center">No locations added.</div>
            ) : (
              Array.isArray(filteredLocations) &&
              filteredLocations?.map((location: any, i) => {
                return (
                  <>
                    <div
                      key={i}
                      onClick={() => {
                        handleValueChange({
                          target: { name: "location", value: location?.name },
                        });
                        setShowPopup(false);
                      }}
                      className="group flex w-full cursor-pointer flex-row items-center gap-2 rounded-[4px] px-3 py-1 hover:bg-neutral-100"
                    >
                      <span className="text-2xl text-neutral-600">
                        <GrLocationPin size={18} />
                      </span>
                      <div className="flex flex-col items-start justify-center gap-0">
                        <span className="text-[14px] font-semibold text-neutral-700">
                          {location.name}
                        </span>
                        {location?.description && (
                          <span className="text-[12px] font-normal text-neutral-400">
                            {location.description}
                          </span>
                        )}
                      </div>
                      <button
                        name="location"
                        className="ml-auto hidden h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full bg-white group-hover:flex"
                      >
                        <FaPlus></FaPlus>
                      </button>
                    </div>
                  </>
                );
              })
            )}
          </div>

          <div className="group flex min-h-[32px] w-full items-center justify-start  gap-3 rounded-sm border border-neutral-300  bg-neutral-100 px-4 py-2 focus-within:border-primary-600">
            <span className="text-2xl">
              <IoIosSearch />
            </span>
            <input
              type="text"
              className="group w-full bg-neutral-100 text-sm font-medium text-neutral-500 outline-none"
              placeholder="Search Locations"
              id="date-search"
              onChange={(e) => {
                setFilterQuery(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`${
          showPopup ? "block" : "hidden"
        } absolute -left-8 -top-28 z-10 h-[1220px] w-[687px] bg-black opacity-5`}
        onClick={() => setShowPopup(false)}
      ></div>
    </>
  );
}
