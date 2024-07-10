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
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!events || events.length === undefined || events.length === 0) return;
    const filteredEvents = events?.filter((e: any) => {
      const date = new Date(e.start);
      const lastDays = new Date(Date.now()-(parseInt(filter)*86400000));
      const futureDays = new Date(Date.now()+(parseInt(filter)*86400000));
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
  }, [filter, events]);

  return (
    <div className="flex flex-col gap-9 px-[70px] pl-9">
      <Toaster />
      <div className=" mt-[80px] flex flex-col gap-[37px]">
        <div className="flex flex-row justify-between">
          <h1 className=" text-[28px] font-[700] text-neutral-700">Summary</h1>
          <span className="ml-auto w-40 text-neutral-500">
            <Select
              value={filter}
              onValueChange={(value) => {
                setFilter(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="7"
                  className={`${filter.toLowerCase() === "7" && "text-primary-600"}`}
                >
                  7 Days
                </SelectItem>
                <SelectItem
                  value="30"
                  className={`${filter.toLowerCase() === "30" && "text-primary-600"}`}
                >
                  30 Days
                </SelectItem>
              </SelectContent>
            </Select>
          </span>
        </div>
        <div className={`flex flex-row justify-between gap-14`}>
          <SummaryCard
            title="Upcoming Events"
            loading={eventsLoading}
            events={filteredEvents?.filter((e: any) => new Date(e.start) > new Date())}
          />
          <SummaryCard
            title="Ongoing Events"
            loading={eventsLoading}
            events={filteredEvents?.filter(
              (e: any) => new Date(e.start).getDate() === new Date().getDate(),
            )}
          />
          <SummaryCard
            title="Closed Events"
            loading={eventsLoading}
            events={filteredEvents?.filter((e: any) => new Date(e.start) < new Date())}
          />
        </div>
        <div className="flex w-full flex-row items-start justify-center gap-[50px]">
          {/** Card */}
          <div className="flex h-full w-full flex-col">
            <div className="flex w-full flex-row  items-center justify-start gap-3.5 rounded-md border-[0.6px] bg-neutral-100 px-5 py-1 text-neutral-700">
              <span className="text-[16px]">Events by Priority</span>
            </div>
            <div className="bg-neutral-50">
              <div className="flex flex-row items-center gap-16 p-5 px-7">
                <div style={{ width: 200, height: 200 }}>
                  <PieChart data={pieChartData}></PieChart>
                </div>
                <div className="flex flex-col items-start justify-center gap-3">
                  {pieChartData.labels.map((label, index) => (
                    <div className="flex flex-row items-center justify-start" key={index}>
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

          <div className="flex h-full w-full flex-col">
            <div className="flex h-full w-full flex-row  items-center justify-start gap-3.5 rounded-md border-[0.6px] bg-neutral-100 px-5 py-1 text-neutral-700">
              <span className="text-[16px]">Events by Department</span>
            </div>
            <div className="bg-neutral-50">
              <div className="flex flex-row items-center gap-16 p-5 px-7">
                <div
                  style={{
                    width: 600,
                    height: 200,
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

          {/** Card */}
          {/* <div className="flex h-full w-full flex-col">
            <div className="flex w-full flex-row  items-center justify-start gap-3.5 rounded-md border-[0.6px] bg-neutral-100 px-5 py-1 text-neutral-700">
              <span className="text-[16px]">Recent Activities</span>
            </div>
            <div className="flex h-full items-center justify-center bg-neutral-50">
              <Image
                src={`/images/noActivities.svg`}
                width={377 - 150}
                height={250 - 150}
                alt={"No activities"}
              ></Image>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
