"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Axios, baseUrl } from "@/services/baseUrl";
import { HiOutlineUsers } from "react-icons/hi";
import "./scrollbar.css";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import { LoaderCircle } from "lucide-react";
interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
}

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [alreadySent, setAlreadySent] = useState<boolean>(false);
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  useEffect(() => {
    fetchDepartments();
    fetchMyRequests();
    checkApproved();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await Axios.get(`/department/request/my`);
      if (response.data.success) {
        for (let request of response.data.data) {
          if (request.status === "PENDING") {
            setAlreadySent(true);
          }
        }
      } else {
        toast.error("Error fetching my requests");
      }
    } catch (error) {
      console.error("Error fetching my requests:", error);
    }
  };

  const generateNewToken = async () => {
    try {
      const response = await Axios.get("/generateNewToken");
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const checkApproved = async () => {
    try {
      const response = await Axios.get(`/profile`);
      if (response.data.success) {
        const userData = response.data.data;
        if (userData.department) {
          const newToken = await generateNewToken();
          Cookies.set("token", newToken, {
            expires: Date.now() + 40 * 86400 * 1000,
          });
          Router.push("/");
        }
      } else {
        toast.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await Axios.get(`/department`);
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const sendJoinRequest = async () => {
    try {
      if (!selectedDepartment) {
        toast.error("Please select a department");
        return;
      }
      setIsLoading(true);
      const response = await Axios.post(`/department/request`, {
        department: selectedDepartment?._id,
      });
      if (response.data.success) {
        toast.success("Join request sent successfully");
        setIsLoading(false);
        fetchMyRequests();
      } else {
        setIsLoading(false);
        toast.error(response.data.message || "Error sending join request");
        console.error("Error sending join request:", response.data.message);
      }
    } catch (error: any) {
      if (error?.response) {
        toast.error(
          error.response?.data?.message || "Error sending join request",
        );
      }
      console.error("Error sending join request:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {alreadySent ? (
        <div className="relative mx-auto my-[60px] flex h-auto w-[660px] flex-col items-center gap-8  pb-[84px] pt-12 font-medium">
          <div className="absolute top-0 flex -translate-y-1/2 transform items-center justify-between gap-[4px] bg-[#FFFFFF] px-3">
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

          <Image
            src={`/alreadySentRequest.svg`}
            alt={""}
            width={737}
            height={362}
            className=" mt-[60px]"
          />
          <div className=" mt-[24px] flex flex-row items-center gap-[6px]">
            <p className=" text-primary-600">Join request has been sent!</p>
            <p>You will receive a mail about the request acceptance</p>
          </div>
        </div>
      ) : (
        <div className="relative mx-auto my-[60px] flex h-auto w-[660px] flex-col items-center gap-8  pb-[84px] pt-12 font-medium">
          {/* Logo  */}
          <div className="absolute top-0 flex -translate-y-1/2 transform items-center justify-between gap-[4px] bg-[#FFFFFF] px-3">
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
          <div className="mt-[29px] flex w-full flex-col items-center gap-[6px] px-4 pl-0">
            <h1 className="w-full text-left text-[20px] font-bold">
              Choose your department
            </h1>
          </div>

          <div className="flex h-[calc(100vh-300px)] w-full flex-col gap-[20px] overflow-y-scroll pr-[12px]">
            {departments &&
              departments.map((department) => {
                return (
                  <>
                    <div
                      onClick={() => setSelectedDepartment(department)}
                      className={` ${
                        department._id === selectedDepartment?._id
                          ? "border border-primary-700 bg-[#EFFBF2] "
                          : "bg-neutral-100 hover:bg-neutral-50"
                      } group flex w-full cursor-pointer flex-row items-center gap-[16px] rounded-[4px] px-[12px] py-3`}
                    >
                      <div
                        className={`flex  h-[32px] w-[32px] items-center justify-center rounded-[4px] p-[3px] ${
                          department._id === selectedDepartment?._id
                            ? "bg-primary-200"
                            : "bg-[#FFFFFF] group-hover:bg-neutral-200"
                        }`}
                      >
                        <HiOutlineUsers
                          className={`text-md text-neutral-600`}
                        />
                      </div>
                      <div className="flex flex-col gap-0">
                        <h2 className="text-[16px] font-bold text-neutral-700 group-hover:text-neutral-900">
                          {department.code}
                        </h2>
                        <p className="text-[13px] text-neutral-400">
                          {department.name}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
          <button
            onClick={sendJoinRequest}
            className="btn w-full rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400"
          >
            Send Join Request{" "}
            {isLoading && <LoaderCircle className="animate-spin" />}
          </button>
        </div>
      )}
    </>
  );
}
