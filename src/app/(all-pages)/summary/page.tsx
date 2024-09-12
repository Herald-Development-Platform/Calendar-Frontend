"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import SummaryCard from "./SummaryCard";
import { useGetEvents } from "@/services/api/eventsApi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Chart } from "chart.js/auto";
import PieChart from "@/components/Chartjs/PieChart";
import colors from "@/constants/Colors";
import BarChart from "@/components/Chartjs/BarChart";
import { useGetDepartments } from "@/services/api/departments";
import DepartmentButton from "@/components/DepartmentButton";
import * as Headers from "@/components/Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DatePicker from "@/components/AddEventModal/DatePicker";

export default function SummaryPage() {
  const [filter, setFilter] = useState("7");
  const [pieChartData, setPieChartData] = useState<{
    labels: any[];
    datasets: any[];
  }>({ labels: [], datasets: [] });

  const [barChartData, setBarChartData] = useState<{
    labels: any[];
    datasets: any[];
  }>({ labels: [], datasets: [] });

  const { data: events, isLoading: eventsLoading } = useGetEvents();
  const { data: departments, isLoading: departmentsLoading } =
    useGetDepartments();
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [selDepartments, setSelDepartments] = useState<string[]>(["All"]);
  const [customDateOpen, setCustomDateOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!Array.isArray(events)) return;
    const filteredEvents = events?.filter((e: any) => {
      if (!selDepartments.includes("All")) {
        let match = false;
        for (let department of e.departments) {
          if (selDepartments.includes(department.code)) {
            match = true;
            break;
          }
        }
        if (!match) {
          return false;
        }
      }
      const date = new Date(e.start);
      const lastDays = new Date(Date.now() - parseInt(filter) * 86400000);
      const futureDays = new Date(Date.now() + parseInt(filter) * 86400000);
      return date >= lastDays && date <= futureDays;
    });
    setFilteredEvents(filteredEvents as any[]);

    let priorityMap: any = {};
    let departmentMap: any = {};
    filteredEvents?.forEach((e: any) => {
      if (priorityMap[e.color]) {
        priorityMap[e.color] += 1;
      } else {
        priorityMap[e.color] = 1;
      }

      for (let department of e.departments) {
        if (departmentMap[department.code]) {
          departmentMap[department.code] += 1;
        } else {
          departmentMap[department.code] = 1;
        }
      }
    });

    setPieChartData({
      labels: Object.keys(priorityMap).map((color) => {
        return colors.find((c) => c.color === color)?.priority;
      }),
      datasets: [
        {
          data: Object.values(priorityMap),
          backgroundColor: Object.keys(priorityMap).map((color: any) => color),
          hoverBackgroundColor: Object.keys(priorityMap).map(
            (color: any) => color,
          ),
        },
      ],
    });

    setBarChartData({
      labels: Object.keys(departmentMap),
      datasets: [
        {
          label: "Events",
          data: Object.values(departmentMap),
          backgroundColor: colors.map((c) => c.color),
          hoverBackgroundColor: colors.map((c) => c.color),
        },
      ],
    });
  }, [filter, events, selDepartments]);

  return (
    <>
      <Headers.GeneralHeader />
      <div className="flex max-h-[100vh] flex-col gap-9 overflow-y-scroll px-[70px] pl-9">
        <Toaster />
        <div className=" mt-[40px] flex flex-col gap-[18px]">
          <div className="flex flex-row justify-between">
            <h1 className=" text-[28px] font-[700] text-neutral-700">
              Summary
            </h1>
            <span className="ml-auto w-40 text-neutral-500">
              <Select
                value={filter}
                onValueChange={(value) => {
                  if (value === "custom-date") {
                    setCustomDateOpen(true);
                    return;
                  }
                  setFilter(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="7"
                    className={`${
                      filter.toLowerCase() === "7" && "text-primary-600"
                    }`}
                  >
                    7 Days
                  </SelectItem>
                  <SelectItem
                    value="30"
                    className={`${
                      filter.toLowerCase() === "30" && "text-primary-600"
                    }`}
                  >
                    30 Days
                  </SelectItem>
                  <SelectItem
                    value="90"
                    className={`${
                      filter.toLowerCase() === "90" && "text-primary-600"
                    }`}
                  >
                    3 months
                  </SelectItem>
                  <SelectItem
                    value="180"
                    className={`${
                      filter.toLowerCase() === "180" && "text-primary-600"
                    }`}
                  >
                    6 months
                  </SelectItem>
                  <SelectItem
                    value="365"
                    className={`${
                      filter.toLowerCase() === "365" && "text-primary-600"
                    }`}
                  >
                    1 year
                  </SelectItem>
                  <SelectItem
                    value="custom-date"
                    className={`${
                      filter.toLowerCase() === "15000000" && "text-primary-600"
                    }`}
                  >
                    Custom Date
                  </SelectItem>
                  <SelectItem
                    value="15000000"
                    className={`${
                      filter.toLowerCase() === "15000000" && "text-primary-600"
                    }`}
                  >
                    All time
                  </SelectItem>
                </SelectContent>
              </Select>
            </span>
          </div>
          <div className=" flex gap-2 ">
            <DepartmentButton
              selectedCross={false}
              value={"All"}
              selected={selDepartments.includes("All")}
              id={"All"}
              onClick={() => {
                if (selDepartments.includes("All")) {
                  setSelDepartments([]);
                } else {
                  setSelDepartments(["All"]);
                }
              }}
            />
            {Array.isArray(departments) &&
              departments?.map((department: any) => (
                <DepartmentButton
                  id={department._id}
                  key={department._id}
                  selectedCross={false}
                  value={department.code}
                  onClick={() => {
                    let newSelectedDepartments = [...selDepartments];
                    if (newSelectedDepartments.includes("All")) {
                      newSelectedDepartments = newSelectedDepartments.filter(
                        (dep) => dep !== "All",
                      );
                    }
                    if (newSelectedDepartments.includes(department.code)) {
                      newSelectedDepartments = newSelectedDepartments.filter(
                        (dep) => dep !== department.code,
                      );
                    } else {
                      newSelectedDepartments = [
                        ...newSelectedDepartments,
                        department.code,
                      ];
                    }
                    if (newSelectedDepartments.length === 0) {
                      newSelectedDepartments = ["All"];
                      return;
                    }
                    setSelDepartments(newSelectedDepartments);
                  }}
                  selected={selDepartments.includes(department.code)}
                />
              ))}
          </div>
          <div className={`flex flex-row justify-between gap-14`}>
            <SummaryCard
              title="Upcoming Events"
              loading={eventsLoading}
              events={filteredEvents?.filter(
                (e: any) => new Date(e.start) > new Date(),
              )}
            />
            <SummaryCard
              title="Ongoing Events"
              loading={eventsLoading}
              events={filteredEvents?.filter(
                (e: any) =>
                  new Date(e.start).getDate() === new Date().getDate(),
              )}
            />
            <SummaryCard
              title="Closed Events"
              loading={eventsLoading}
              events={filteredEvents?.filter(
                (e: any) => new Date(e.start) < new Date(),
              )}
            />
          </div>
          <div className="mt-4 flex w-full flex-row flex-wrap items-start gap-4 ">
            {/** Card */}
            <div className="flex h-auto w-fit flex-col">
              <div className="flex w-full flex-row  items-center justify-start gap-3.5 rounded-md border-[0.6px] bg-neutral-100 px-5 py-1 text-neutral-700">
                <span className="text-[16px]">Events by Priority</span>
              </div>
              <div className="bg-neutral-50">
                <div className="flex flex-row items-center gap-16 p-5 px-7">
                  <div style={{ width: "100%", height: 200 }}>
                    <PieChart data={pieChartData}></PieChart>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-3">
                    {pieChartData.labels.map((label, index) => (
                      <div
                        className="flex flex-row items-center justify-start"
                        key={index}
                      >
                        <span
                          className={`h-6 w-6 rounded-md`}
                          style={{
                            backgroundColor:
                              pieChartData.datasets[0].backgroundColor[index],
                          }}
                        />
                        <span className="ml-3 text-[16px]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-auto w-fit flex-col">
              <div className="flex h-full w-full flex-row  items-center justify-start gap-3.5 rounded-md border-[0.6px] bg-neutral-100 px-5 py-1 text-neutral-700">
                <span className="text-[16px]">Events by Department</span>
              </div>
              <div className=" bg-neutral-50 px-7 py-5">
                <div
                  style={{
                    width: "100%",
                    height: 200,
                    minWidth: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BarChart data={barChartData}></BarChart>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={customDateOpen} onOpenChange={setCustomDateOpen}>
        <DialogContent className="min-w-[652px]">
          <DialogHeader>
            <DialogTitle className="mb-10">Custom Date</DialogTitle>
            <DialogDescription>
              <span className="text-neutral-600">Date</span>
              <div className="mt-2 flex w-full flex-row items-center gap-2">
                <DatePicker
                  value={new Date()}
                  handleValueChange={() => {}}
                  name={"start"}
                />
                <span className="text-neutral-600">To</span>
                <DatePicker
                  value={new Date()}
                  name={"end"}
                  handleValueChange={() => {}}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
