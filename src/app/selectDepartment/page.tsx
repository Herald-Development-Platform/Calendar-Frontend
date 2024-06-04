"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Axios, baseUrl } from "@/services/baseUrl";
import { HiOutlineUsers } from "react-icons/hi";
import './scrollbar.css';

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
}

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await Axios.get(`/department`);
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  return (
    <>
      <div className="relative mx-auto my-[80px] flex h-auto w-[660px] flex-col items-center gap-8  pb-[84px] pt-12 font-medium">
        {/* Logo  */}
        <div className="absolute top-0 flex -translate-y-1/2 transform items-center justify-between gap-2 bg-[#FFFFFF] px-3">
          <Image
            width="32"
            height="32"
            src={"/images/LoginPage/HeraldLogo.png"}
            alt="HeraldLogo"
            className="h-auto w-auto"
          />
          <div className="text-2xl ">
            <span className="text-primary-600"> Herald </span>
            <span className="text-neutral-600">Calendar</span>
          </div>
        </div>

        {/* Title  */}
        <div className="mt-[38px] flex w-full flex-col items-center gap-[6px] px-4 pl-0">
          <h1 className="w-full text-left text-[20px] font-bold">
            Choose your department
          </h1>
        </div>

        <div className="h-[calc(100vh-250px)] overflow-y-scroll w-full flex flex-col gap-[20px] pr-[12px]">
        {departments &&
          departments.map((department) => {
            return (
              <>
                <div onClick={()=>setSelectedDepartment(department)} className={`${department._id === selectedDepartment?._id?"bg-[#EFFBF2] border border-primary-700":"bg-neutral-100"} cursor-pointer flex w-full flex-row items-center gap-[16px] rounded-[4px] px-[12px] py-3`}>
                  <div className={`p-[3px] w-[32px] h-[32px] flex items-center justify-center focus:bg-black rounded-[4px] ${
                        department._id === selectedDepartment?._id
                          ? "bg-primary-200"
                          : "bg-[#FFFFFF]"
                      }`}>
                    <HiOutlineUsers
                      className={`text-md text-neutral-600`}
                    />
                  </div>
                  <div className="flex flex-col gap-0">
                    <h2 className="text-[16px] font-bold text-neutral-700">
                      {department.name}
                    </h2>
                    <p className="text-[13px] text-neutral-400">
                      {department.description}
                    </p>
                  </div>
                </div>
              </>
            );
          })}
          </div>
      </div>
    </>
  );
}
