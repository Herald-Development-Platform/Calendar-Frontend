"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetLocation } from "@/services/api/locations";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { GrLocationPin } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { PopoverClose } from "@radix-ui/react-popover";
import { Input } from "../ui/input";

export function LocationSelect({
  value,
  handleValueChange,
}: {
  value: string;
  handleValueChange: (e: any) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const { data: locations, isLoading } = useGetLocation();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-0"
        >
          <Input
            type="text"
            value={locations?.find((location) => location.name === value)?.name || value}
            onChange={(e) => {
              handleValueChange({
                target: { name: "location", value: e.target.value },
              });
            }}
          />
          {/* {value
            ? locations?.find((location) => location.name === value)?.name
            : "Select Locations..."} */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[999] w-[400px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search Location..." />
          <CommandList>
            <CommandEmpty>No Location found.</CommandEmpty>
            <CommandGroup>
              {locations?.map((location, index) => (
                <CommandItem
                  key={index}
                  value={location.name}
                  onSelect={() => {
                    handleValueChange({
                      target: { name: "location", value: location?.name },
                    });
                    setOpen(false);
                  }}
                  className="group flex w-full cursor-pointer flex-row items-center gap-2 rounded-[4px] px-3 py-1 hover:bg-neutral-100"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === location.name ? "opacity-100" : "opacity-0",
                    )}
                  />
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
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
