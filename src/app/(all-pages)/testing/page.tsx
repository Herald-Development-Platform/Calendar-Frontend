"use client";
import React, { useEffect, useState } from "react";
import * as Headers from "@/components/Header";
import { Axios } from "@/services/baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CiSearch } from "react-icons/ci";
import DepartmentBtn from "@/components/AddEventModal/DepartmentBtn";
import { FaPlus } from "react-icons/fa";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdOutlineEdit } from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";
import { FaCircleUser } from "react-icons/fa6";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
}

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([]);

  const queryClient = useQueryClient();

  const { data: departmentRequests, isLoading: departmentRequestsLoading } = useQuery({
    queryKey: ["UnapprovedUsers"],
    queryFn: () => Axios.get("/department/request?status=PENDING"),
  });

  const { data: allUsers, isLoading:allUsersLoading } = useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => Axios.get("/profile/all"),
  });

  useEffect(()=>{
    console.log("allUsers: ", allUsers?.data?.data);
  }, [allUsers])

  const { mutate: approveUser } = useMutation({
    mutationFn: (payload: any) =>
      Axios.put(`/department/request/${payload?._id}`, {
        status: payload?.status,
      }),
    onSuccess: async (response) => {
        console.log("Approve response:\n", response);
        if (response.status >= 400 && response.status < 500 ) {
            toast.error(response?.data?.message || response?.data?.error || "Error process request!");
            return;
        } else {
            toast.success(`User ${response.data?.data?.request?.status === "APPROVED" ? "approved successfully" : "rejected"}`);
        }
        queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
        queryClient.invalidateQueries({ queryKey: ["UnapprovedUsers"] });
    },
  });


  useEffect(() => {
    console.log("departmentRequests: ", departmentRequests?.data?.data);
  }, [departmentRequests]);
  
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
    <div className="flex flex-col gap-9 px-[70px] pl-3">
        <Toaster />
      <Headers.DepartmentHeader />
      <div className=" flex flex-col gap-[27px]">
        <div className="flex flex-row justify-between">
            <h1 className=" text-[28px] text-black font-[700]">Team</h1>
            <div className=" w-[306px] h-[32px] flex flex-row items-center justify-start py-2 px-3 border rounded-[4px] gap-3 bg-neutral-100">
                <span className=" text-neutral-500 font-bold"><CiSearch /></span>
                <input
                    type="text"
                    placeholder="Search"
                    className="border-2 bg-neutral-100 border-gray-300 rounded-md p-1 outline-none border-none"
                />
            </div>
        </div>
        <>
            {departmentRequests?.data?.data?.map((request:any)=>{
                console.log("request: ", request)
                if (request.status !== "PENDING") {
                    return null;
                }
                return (
                <div className="bg-neutral-100 justify-between rounded-[4px] gap-2.5 px-9 py-4 flex items-center">
                    <div className="flex flex-row justify-start items-center gap-3">
                        {request?.user.photo ? (
                            <img src={request?.user.photo} alt={`Photo of ${request?.user?.username}`} className=" w-10 rounded-full" />
                        ) : (
                            <span className="text-3xl text-neutral-500"><FaCircleUser /></span>
                        )}
                        <div className=" flex flex-col justify-center items-start">
                            <h1 className=" font-semibold text-[16px]">{request?.user?.username}</h1>
                            <p>Wants to join {request?.department?.code} Department</p>
                        </div>
                    </div>
                    <div className=" flex flex-row gap-4 h-8 ">
                        <button className=" flex justify-center items-center bg-success-500 text-500 text-[13px] text-white px-4 py-2 rounded-md" onClick={() => {approveUser({_id: request._id, status:"APPROVED"})}}>Approve</button>
                        <button className="flex justify-center items-center bg-danger-500 text-500 text-[13px] text-white px-4 py-2 rounded-md" onClick={() => {approveUser({_id: request._id, status:"REJECTED"})}}>Deny</button>
                    </div>
                </div>
            )})}
        </>
        
        <div className="flex flex-row justify-start items-center gap-1.5  ">
            <DepartmentBtn department="All"/>
            {departments.map((department: Department) => <DepartmentBtn department={department.code} />)}
            <span onClick={()=>{

            }} className="text-white hover:bg-primary-600 cursor-pointer transition-colors font-semibold text-[12px] bg-primary-500 py-2 px-4 rounded-full"><FaPlus /></span>
        </div>
        {allUsersLoading ? (
            <div className="w-full flex flex-row justify-center items-center h-full">Loading ...</div>
        ) : (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px] text-neutral-600">Name</TableHead>
                <TableHead className=" text-neutral-600 w-[76px]">Department</TableHead>
                <TableHead className=" text-neutral-600 w-[76px]">Role</TableHead>
                <TableHead className="text-right text-neutral-600 w-[76px]">Edit</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allUsers?.data?.data?.map((user: any) => (
                    user.role !== "SUPER_ADMIN" && user.department &&
                    <TableRow key={user._id}>
                        <TableCell className="w-[437px]">
                            <div className="flex flex-row justify-start items-center gap-3">
                                {user.photo ? (
                                    <img src={user.photo} alt={`Photo of ${user?.username}`} className=" w-10 rounded-full" />
                                ) : (
                                    <span className="text-3xl text-neutral-500"><FaCircleUser /></span>
                                )}
                                <div className=" flex flex-col justify-center items-start">
                                    <h1 className=" font-semibold text-[16px]">{user?.username}</h1>
                                    <p>{user?.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="w-10 text-neutral-500 font-600">{user?.department?.code}</TableCell>
                        <TableCell className="w-[76px] ">
                            <Select defaultValue={user?.role} className="outline-none border-none focus:outline-none focus:border-none">
                                <SelectTrigger>
                                    <SelectValue  placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STAFF">Staff</SelectItem>
                                    <SelectItem value="DEPARTMENT_ADMIN">Department Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="text-right w-[76px]">
                        <button
                            onClick={() => {}}
                            className=" text-primary-600 text-xl"
                        >
                            <MdOutlineEdit/>
                        </button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>)}
      </div>
    </div>
  );
}
