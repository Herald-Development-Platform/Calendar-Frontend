"use client";
import React, { useEffect, useState } from "react";
import * as Headers from "@/components/Header";
import { Axios } from "@/services/baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CiSearch } from "react-icons/ci";
import DepartmentBtn from "@/components/DepartmentButton";
import { FaPlus } from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdOutlineEdit } from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";
import { FaCircleUser } from "react-icons/fa6";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { BiPencil } from "react-icons/bi";
import { postDepartment, updateUser } from "@/services/api/departments";
import { useForm } from "react-hook-form";

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selDepartments, setSelDepartments] = useState<string[]>(["All"]);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState<boolean>(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data: departmentRequests, isLoading: departmentRequestsLoading } = useQuery({
    queryKey: ["UnapprovedUsers"],
    queryFn: () => Axios.get("/department/request?status=PENDING"),
  });

  const { data: allUsers, isLoading:allUsersLoading } = useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => Axios.get("/profile/all"),
  });

  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);

  useEffect(()=> {
    if (allUsers?.data?.data) {
      filterList("");
    }
  }, [allUsers]);
  
  useEffect(()=>{
    console.log("Searched Users:\n",searchedUsers);
  }, [searchedUsers]);

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

  const {
    register:registerDepartment,
    handleSubmit:handleDepartmentSubmit,
    formState: { errors:departmentFormError },
    reset:resetDepartmentForm,
  } = useForm({defaultValues: {
    code: "",
    name: "",
  }});

  const {
    register:registerUser,
    getValues:getUserValues,
    watch: watchUserValues,
    handleSubmit:handleUserSubmit,
    formState: { errors:userFormError },
    reset:resetUserForm
  } = useForm({defaultValues: {
    email:"",
    username: "",
    role: "",
    department: "",
  }});

  const onUserEditSubmit = async (data: any) => {
    const previousData = allUsers?.data?.data?.find((user: any) => user.email === data.email);
    if (data.role === previousData.role && data.department === previousData.department._id) {
      return;
    }
    const response = await updateUser({
      id: previousData._id,
      role: data.role,
      department: data.department,
    });
    if (response.status >= 400 && response.status < 500 ) {
        toast.error(response?.data?.message || response?.data?.error || "Error process request!");
        return;
    } else {
        toast.success("User updated successfully");
        resetUserForm();
        }
        queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
        queryClient.invalidateQueries({ queryKey: ["UnapprovedUsers"] });
  }

  const onDepartmentSubmit = async (data: any) => {
    const response = await postDepartment(data);
    if (response.status >= 400 && response.status < 500 ) {
        toast.error(response?.data?.message || response?.data?.error || "Error process request!");
        return;
    } else {
        toast.success("Department created successfully");
        fetchDepartments();
        resetDepartmentForm();
      }
  };

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

  const filterList = (q:string) => {
    if (q.trim() === "") {
      setSearchedUsers(allUsers?.data?.data);
      return;
    }
    console.log(q);
    let newSearchedUsers = allUsers?.data?.data?.filter((user: any) => {
      console.log("User: ", user);
      if (user.role === "SUPER_ADMIN" || !user.department) {
        return false;
      }
      if (selDepartments.includes("All") || selDepartments.includes(user?.department?.code)) {
        const reg = new RegExp(q, "ig");
        return reg.test(user.username) || reg.test(user.email);
      }
      return false;
    });
    setSearchedUsers(newSearchedUsers);
  }

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
                    // value={searchQuery}
                    onChange={(e)=>{
                      // setSearchQuery(e.target.value);
                      filterList(e.target.value);
                    }}
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
                <div key={request._id} className="bg-neutral-100 justify-between rounded-[4px] gap-2.5 px-9 py-4 flex items-center">
                    <div className="flex flex-row justify-start items-center gap-3">
                        {request?.user.photo ? (
                            <img src={request?.user.photo} alt={`Photo of ${request?.user?.username}`} className=" w-10 rounded-full" />
                        ) : (
                            <span className="text-3xl text-neutral-500"><FaCircleUser /></span>
                        )}
                        <div className=" flex flex-col justify-center items-start">
                            <h1 className=" font-semibold text-[16px] text-neutral-900">{request?.user?.email}</h1>
                            <p className=" text-neutral-500 font-400"><span className=" font-medium">{request?.user?.username}</span> wants to join <span className=" font-medium">{request?.department?.name}</span></p>
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
            <DepartmentBtn
              selectedCross={false}
              value={"All"}
              selected={selDepartments.includes("All")} 
              onClick={()=>{
                if (selDepartments.includes("All")){
                  setSelDepartments([]);
                } else {
                  setSelDepartments(["All"]);
                }
              }} 
            />
            {departments && 
            departments.map((department: Department,) => (
              <DepartmentBtn
              key={department._id}
                selectedCross={false}
                value={department.code}
                onClick={()=>{
                  let newSelectedDepartments = [...selDepartments]
                  if (newSelectedDepartments.includes("All")) {
                      newSelectedDepartments = newSelectedDepartments.filter((dep) => dep !== "All");
                  }
                  if (newSelectedDepartments.includes(department.code)) {
                      newSelectedDepartments=newSelectedDepartments.filter((dep) => dep !== department.code);
                  } else {
                      newSelectedDepartments = [...newSelectedDepartments, department.code];
                  }
                  if (newSelectedDepartments.length === 0) {
                      newSelectedDepartments = ["All"];
                      return;
                  }
                  setSelDepartments(newSelectedDepartments);
              }}
              selected={selDepartments.includes(department.code)} />
              )
            )}
            <span onClick={()=>{
              setDepartmentDialogOpen(true);
            }} className="text-white hover:bg-primary-600 cursor-pointer transition-colors font-semibold text-[12px] bg-primary-500 py-2 px-4 rounded-full"><FaPlus /></span>
        </div>
        <Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className=" font-semibold text-[19px] ">Add Department</DialogTitle>
            </DialogHeader>
            <form className="py-2" onSubmit={handleDepartmentSubmit(onDepartmentSubmit)}>
              <label htmlFor="add-title">
                <div className="group flex h-11 w-full items-center gap-2  border-b-[1px] border-neutral-300 px-4 focus-within:border-primary-600">
                  <span className="text-xl">
                    <BiPencil />
                  </span>
                  <input
                    type="text"
                    placeholder="Department Code"
                    className="w-full text-lg font-normal text-neutral-900 outline-none"
                    {...registerDepartment("code", {
                      required: "Code is required",
                    })}
                  />
                </div>
              </label>

              <div className="mt-[32px]">
                <span className="text-[14px] font-500">
                Department Name <br />
                </span>
                <input
                  type="text"
                  className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
                  {
                    ...registerDepartment("name", {
                      required: "Name is required",
                    })
                  }
                />
              </div>
            </form>
            <DialogFooter className=" flex flex-row justify-end items-center py-4">
            <button
            onClick={() => {
              handleDepartmentSubmit(onDepartmentSubmit)();
              setDepartmentDialogOpen(false);
            }}
              className="btn btn-md h-5 border-none bg-primary-600 hover:bg-primary-700 text-base font-medium text-primary-50"
            >
              Create
            </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className=" font-semibold text-[19px] ">Edit User</DialogTitle>
            </DialogHeader>
            <form className="py-2 flex flex-col gap-8" onSubmit={handleDepartmentSubmit(onDepartmentSubmit)}>
              <label htmlFor="add-title">
                <div className="group flex h-11 w-full items-center gap-2 border-b-[1px] border-neutral-300 px-4 focus-within:border-primary-600">
                  <input
                    type="text"
                    placeholder="Username"
                    readOnly={true}
                    value={watchUserValues("username")}
                    className="w-full text-lg font-normal text-neutral-900 outline-none"
                    {...registerUser("username", {
                      required: "Username is required",
                    })}
                  />
                </div>
              </label>

              <div className=" flex flex-col gap-2 ">
                <span className="text-[14px] font-500">
                Email <br />
                </span>
                <input
                  type="email"
                  readOnly={true}
                  value={watchUserValues("email")}
                  className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
                  {
                    ...registerUser("email", {
                      required: "Email is required",
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <span className="text-[14px] font-500">
                Department <br />
                </span>
                <div className=" flex flex-row flex-wrap items-center justify-start gap-2">
                  {
                    departments.map((department: Department)=>(
                      <DepartmentBtn 
                      key={department._id}
                        selectedCross={false}
                        onClick={() => {
                          resetUserForm({
                            ...getUserValues(),
                            department: department._id,
                          })
                        }}
                        value={department.code}
                        selected={getUserValues("department") === department._id}
                      />
                    ))
                  }
                </div>
              </div>

              <div className="flex flex-col gap-2 ">
                <span className="text-[14px] font-500">
                  Role <br />
                  </span>
                  <Select onValueChange={(e)=>{
                    resetUserForm({
                      ...getUserValues(),
                      role: e,
                    })
                  }}  defaultValue={getUserValues("role")}>
                      <SelectTrigger>
                          <SelectValue  placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="STAFF">Officer</SelectItem>
                          <SelectItem value="DEPARTMENT_ADMIN">Head of Department</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

            </form>
            <DialogFooter className=" flex flex-row justify-end items-center py-4">
            <button
            onClick={() => {
              handleUserSubmit(onUserEditSubmit)();
              setEditUserDialogOpen(false);
            }}
              className="btn btn-md h-5 border-none bg-primary-600 hover:bg-primary-700 text-normal font-medium text-primary-50"
            >
              Save
            </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                {searchedUsers?.map((user: any) => (
                    user.role !== "SUPER_ADMIN" && user.department && (selDepartments.includes("All") || selDepartments.includes(user?.department?.code)) &&
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
                            <Select defaultValue={user?.role} onValueChange={(val)=>{
                              onUserEditSubmit({
                                email: user?.email,
                                username: user?.username,
                                role: val,
                                department: user?.department?._id,
                              })
                            }}>
                                <SelectTrigger>
                                    <SelectValue  placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STAFF">Officer</SelectItem>
                                    <SelectItem value="DEPARTMENT_ADMIN">Head of Department</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="text-right w-[76px]">
                        <button
                            onClick={() => {
                              console.log("User: ", user)
                              resetUserForm({
                                  email: user?.email,
                                  username: user?.username,
                                  role: user?.role,
                                  department: user?.department?._id,
                              });
                                setEditUserDialogOpen(true);
                            }}
                            className=" text-primary-600 text-xl"
                        >
                            <MdOutlineEdit/>
                        </button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      )}
      </div>
    </div>
  );
}
