"use client";
import React, { useContext, useEffect, useState } from "react";
import * as Headers from "@/components/Header";
import { Axios } from "@/services/baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CiSearch } from "react-icons/ci";
import { MdArrowDropDown } from "react-icons/md";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

import DepartmentBtn from "@/components/DepartmentButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";
import { FaCircleUser, FaPlus } from "react-icons/fa6";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/services/api/departments";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants/role";
import ContextProvider, { Context } from "@/app/clientWrappers/ContextProvider";
import { PERMISSIONS, READABLE_PERMISSIONS } from "@/constants/permissions";
import DepartmentButton from "@/components/DepartmentButton";
import { IoIosSearch } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Page() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selDepartments, setSelDepartments] = useState<string[]>(["All"]);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState<boolean>(false);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] =
    useState<boolean>(false);
  const [changeRoleVerificationModalOpen, setChangeRoleVerificationModalOpen] =
    useState<boolean>(false);
  const [updatingUserData, setUpdatingUserData] = useState<User>();

  const { userData: profile } = useContext(Context);
  console.log("User data from members page", profile);

  const queryClient = useQueryClient();

  const { data: departmentRequests, isLoading: departmentRequestsLoading } =
    useQuery({
      queryKey: ["UnapprovedUsers"],
      queryFn: () => Axios.get("/department/request?status=PENDING"),
    });

  const { data: allUsers, isLoading: allUsersLoading } = useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => Axios.get("/profile/all"),
  });

  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (allUsers?.data?.data) {
      filterList("");
    }
  }, [allUsers]);

  useEffect(() => {}, [searchedUsers]);

  const { mutate: approveUser } = useMutation({
    mutationFn: (payload: any) =>
      Axios.put(`/department/request/${payload?._id}`, {
        status: payload?.status,
      }),
    onSuccess: async (response) => {
      if (response.status >= 400 && response.status < 500) {
        toast.error(
          response?.data?.message ||
            response?.data?.error ||
            "Error process request!",
        );
        return;
      } else {
        toast.success(
          `User ${response.data?.data?.request?.status === "APPROVED" ? "approved successfully" : "rejected"}`,
        );
      }
      queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["UnapprovedUsers"] });
    },
  });

  const {
    register: registerUser,
    getValues: getUserValues,
    watch: watchUserValues,
    handleSubmit: handleUserSubmit,
    formState: { errors: userFormError },
    reset: resetUserForm,
  } = useForm({
    defaultValues: {
      email: "",
      username: "",
      role: "",
      department: "",
      permissions: [],
    },
  });

  const onUserEditSubmit = async (data: any) => {
    const previousData = allUsers?.data?.data?.find(
      (user: any) => user.email === data.email,
    );
    if (
      data.role === previousData.role &&
      data.department === previousData.department._id
    ) {
      return;
    }
    const response = await updateUser({
      id: previousData._id,
      role: data.role,
      department: data.department,
    });
    if (response.status >= 400 && response.status < 500) {
      toast.error(
        response?.data?.message ||
          response?.data?.error ||
          "Error process request!",
      );
      return;
    } else {
      toast.success("User updated successfully");
      resetUserForm();
    }
    setUpdatingUserData(undefined);
    queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
    queryClient.invalidateQueries({ queryKey: ["UnapprovedUsers"] });
  };

  useEffect(() => {}, [departmentRequests]);

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

  const filterList = (q: string) => {
    if (q.trim() === "") {
      setSearchedUsers(allUsers?.data?.data);
      return;
    }
    let newSearchedUsers = allUsers?.data?.data?.filter((user: any) => {
      if (user.role === ROLES.SUPER_ADMIN || !user.department) {
        return false;
      }
      if (
        selDepartments.includes("All") ||
        selDepartments.includes(user?.department?.code)
      ) {
        const reg = new RegExp(q, "ig");
        return reg.test(user.username) || reg.test(user.email);
      }
      return false;
    });
    setSearchedUsers(newSearchedUsers);
  };

  const deleteUser = (id: string) => {
    Axios.delete(`/profile/${id}`)
      .then((response) => {
        if (response.status >= 400 && response.status < 500) {
          toast.error(
            response?.data?.message ||
              response?.data?.error ||
              "Error process request!",
          );
          return;
        } else {
          toast.success("User deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
          setDeleteUserDialogOpen(false);
          setUpdatingUserData(undefined);
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const showPopover = true;

  return (
    <div className="flex flex-col gap-9 px-[70px] pl-3">
      <Toaster />
      <Headers.DepartmentHeader />

      <Dialog
        open={changeRoleVerificationModalOpen}
        onOpenChange={(open) => {
          setChangeRoleVerificationModalOpen(open);
          setUpdatingUserData(undefined);
          queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" text-[19px] font-semibold ">
              Update Role
            </DialogTitle>
          </DialogHeader>
          <div>
            Do you really want to change the role of{" "}
            {updatingUserData?.username} to{" "}
            {updatingUserData?.role === "STAFF"
              ? "Officer"
              : "Head of Department"}
          </div>
          <DialogFooter className=" flex flex-row items-center justify-end py-4">
            <button
              onClick={() => {
                resetUserForm({
                  email: updatingUserData?.email,
                  username: updatingUserData?.username,
                  role: updatingUserData?.role,
                  department: updatingUserData?.department?._id,
                });
                handleUserSubmit(onUserEditSubmit)();
                setChangeRoleVerificationModalOpen(false);
              }}
              className="btn btn-md h-5 border-none bg-primary-600 text-base font-medium text-primary-50 hover:bg-primary-700"
            >
              Update
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" text-[19px] font-semibold ">
              Edit User
            </DialogTitle>
          </DialogHeader>
          <form
            className="flex max-h-[60vh] flex-col gap-8 overflow-y-scroll py-2 pr-2"
            onSubmit={handleUserSubmit(onUserEditSubmit)}
          >
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
              <span className="font-500 text-[14px]">
                Email <br />
              </span>
              <input
                type="email"
                readOnly={true}
                value={watchUserValues("email")}
                className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
                {...registerUser("email", {
                  required: "Email is required",
                })}
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <span className="font-500 text-[14px]">
                Department <br />
              </span>
              <div className=" flex flex-row flex-wrap items-center justify-start gap-2">
                {departments.map((department: Department) => (
                  <DepartmentBtn
                    id={department._id}
                    key={department._id}
                    selectedCross={false}
                    handleQueryParams={() => {
                      if (!profile) {
                        return;
                      }
                      if (profile?.role !== ROLES.SUPER_ADMIN) {
                        return;
                      }
                      resetUserForm({
                        ...getUserValues(),
                        department: department._id,
                      });
                    }}
                    value={department.code}
                    selected={getUserValues("department") === department._id}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 ">
              <span className="font-500 text-[14px]">
                Role <br />
              </span>
              <Select
                onValueChange={(e) => {
                  resetUserForm({
                    ...getUserValues(),
                    role: e,
                  });
                }}
                value={watchUserValues("role")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">Officer</SelectItem>
                  <SelectItem value="DEPARTMENT_ADMIN">
                    Head of Department
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 ">
              <span className="font-500 text-[14px]">
                Permissions <br />
              </span>
              <div className="flex flex-row items-center gap-4 rounded-md border-[1px] border-neutral-300 px-1 py-1">
                <div className="hide-scrollbar flex flex-row items-center gap-1 overflow-x-scroll">
                  {watchUserValues("permissions")?.map((permission: string) => (
                    <DepartmentButton
                      selectedCross={true}
                      value={permission}
                      selected={true}
                      id={permission}
                      key={permission}
                      handleQueryParams={() => {
                        resetUserForm({
                          ...getUserValues(),
                          permissions: watchUserValues("permissions").filter(
                            (perm: string) => perm !== permission,
                          ),
                        });
                      }}
                    />
                  ))}
                </div>

                {/** ------------------ */}
                <Popover>
                  <PopoverTrigger>
                    <span
                      className="ml-auto w-6 cursor-pointer text-2xl text-neutral-500"
                      onClick={() => {}}
                    >
                      <MdArrowDropDown />
                    </span>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    className="max-h-[370px] w-[350px] gap-2.5 overflow-y-scroll px-6 py-4"
                  >
                    <div className=" flex flex-col gap-2.5">
                      <span className=" text-[13px] font-semibold text-neutral-600">
                        User Permissions
                      </span>
                      <div className=" flex flex-col items-start justify-start gap-2.5">
                        {/* {[
                          PERMISSIONS.CREATE_USER,
                          PERMISSIONS.UPDATE_USER,
                          PERMISSIONS.DELETE_USER,
                        ].map((permission) => {
                          return (
                            <div className="flex flex-row items-center justify-start gap-1">
                              <span className=" text-primary-500">
                                {watchUserValues("permissions")?.includes(permission) ? <MdCheckBox /> :
                                <MdCheckBoxOutlineBlank />
                        }
                              </span>
                              <span className=" text-[13px] font-[500] text-neutral-900">
                                {(READABLE_PERMISSIONS as any)[permission]}
                              </span>
                            </div>
                          );
                        })} */}
                      </div>
                      {/* <span>Department Permissions</span>
                      <div className="flex flex-col items-start justify-start">
                        {[PERMISSIONS.CREATE_DEPARTMENT, PERMISSIONS.UPDATE_DEPARTMENT, PERMISSIONS.DELETE_DEPARTMENT, PERMISSIONS.MANAGE_DEPARTMENT_REQUEST].map(permission=>{
                          return (<div>
                            {permission}
                          </div>);
                        })}
                      </div>
                      <span>Other Permissions</span>
                      <div className="flex flex-col items-start justify-start">
                        {[PERMISSIONS.VIEW_EVENTS_FOR_ALL_DEPARTMENT].map(permission=>{
                          return (<div>
                            {permission}
                          </div>);
                        })}
                      </div> */}
                    </div>
                  </PopoverContent>
                </Popover>

                {/** ------------------ */}
              </div>
            </div>
            <div className="flex flex-col gap-2 ">
              <span className="font-500 text-[14px]">
                Remove Member <br />
              </span>
              <button
                onClick={() => {}}
                className="text-normal btn btn-md h-5 rounded-md border-none bg-red-400 font-medium text-primary-50 hover:bg-red-500"
              >
                Remove
              </button>
            </div>
          </form>
          <DialogFooter className=" flex flex-row items-center justify-end py-4">
            <button
              onClick={() => {
                handleUserSubmit(onUserEditSubmit)();
                setEditUserDialogOpen(false);
              }}
              className="text-normal btn btn-md h-5 border-none bg-primary-600 font-medium text-primary-50 hover:bg-primary-700"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteUserDialogOpen}
        onOpenChange={() => {
          setDeleteUserDialogOpen(false);
          setUpdatingUserData(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <p className="text-neutral-700">
              Type{" "}
              <span className="font-semibold">
                {updatingUserData?.username}
              </span>{" "}
              to delete the user.
            </p>
            <input
              type="text"
              id="delete-verification"
              className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
              placeholder="Username to delete"
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                const verification = document.getElementById(
                  "delete-verification",
                ) as HTMLInputElement;
                if (verification.value !== updatingUserData?.username) {
                  return;
                }
                updatingUserData && deleteUser(updatingUserData?._id);
              }}
              className="btn btn-md h-5 border-none bg-red-500 text-sm font-medium text-primary-50 hover:bg-red-600"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className=" flex flex-col gap-[27px]">
        <div className="flex flex-row justify-between">
          <h1 className=" text-[28px] font-[700] text-black">Team</h1>
          <div className=" flex h-[32px] w-[306px] flex-row items-center justify-start gap-3 rounded-[4px] border bg-neutral-100 px-3 py-2">
            <span className=" font-bold text-neutral-500">
              <CiSearch />
            </span>
            <input
              onChange={(e) => {
                filterList(e.target.value);
              }}
              type="text"
              placeholder="Search"
              className="rounded-md border-2 border-none border-gray-300 bg-neutral-100 p-1 outline-none"
            />
          </div>
        </div>
        <>
          {profile &&
            profile.permissions.includes(
              PERMISSIONS.MANAGE_DEPARTMENT_REQUEST,
            ) &&
            departmentRequests?.data?.data?.map((request: any) => {
              if (request.status !== "PENDING") {
                return null;
              }
              return (
                <div
                  key={request._id}
                  className="flex items-center justify-between gap-2.5 rounded-[4px] bg-neutral-100 px-9 py-4"
                >
                  <div className="flex flex-row items-center justify-start gap-3">
                    {request?.user.photo ? (
                      <img
                        src={request?.user.photo}
                        alt={`Photo of ${request?.user?.username}`}
                        className=" w-10 rounded-full"
                      />
                    ) : (
                      <span className="text-3xl text-neutral-500">
                        <FaCircleUser />
                      </span>
                    )}
                    <div className=" flex flex-col items-start justify-center">
                      <h1 className=" text-[16px] font-semibold text-neutral-900">
                        {request?.user?.email}
                      </h1>
                      <p className=" font-400 text-neutral-500">
                        <span className=" font-medium">
                          {request?.user?.username}
                        </span>{" "}
                        wants to join{" "}
                        <span className=" font-medium">
                          {request?.department?.name}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className=" flex h-8 flex-row gap-4 ">
                    <button
                      className=" text-500 flex items-center justify-center rounded-md bg-success-500 px-4 py-2 text-[13px] text-white"
                      onClick={() => {
                        approveUser({ _id: request._id, status: "APPROVED" });
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="text-500 flex items-center justify-center rounded-md bg-danger-500 px-4 py-2 text-[13px] text-white"
                      onClick={() => {
                        approveUser({ _id: request._id, status: "REJECTED" });
                      }}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              );
            })}
        </>
        <div className="flex flex-row justify-between">
          <div className="flex max-w-[80vw] flex-row items-center justify-start gap-1.5">
            {profile && profile.role === ROLES.SUPER_ADMIN && (
              <DepartmentBtn
                selectedCross={false}
                value={"All"}
                selected={selDepartments.includes("All")}
                id={"All"}
                handleQueryParams={() => {
                  if (selDepartments.includes("All")) {
                    setSelDepartments([]);
                  } else {
                    setSelDepartments(["All"]);
                  }
                }}
              />
            )}

            {profile &&
              profile.role === ROLES.SUPER_ADMIN &&
              departments &&
              departments.map((department: Department) =>
                profile?.role === ROLES.SUPER_ADMIN ||
                profile?.department?._id === department._id ? (
                  <DepartmentBtn
                    id={department._id}
                    key={department._id}
                    selectedCross={false}
                    value={department.code}
                    handleQueryParams={() => {
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
                ) : (
                  <></>
                ),
              )}
          </div>
          <div className="flex flex-row ">
            {profile &&
              (profile.permissions.includes(PERMISSIONS.CREATE_DEPARTMENT) ||
                profile.permissions.includes(
                  PERMISSIONS.UPDATE_DEPARTMENT,
                )) && (
                <span
                  onClick={() => router.push("/department")}
                  className=" cursor-pointer text-[14px] font-semibold text-info-600 underline underline-offset-2"
                >
                  Manage Departments
                </span>
              )}
          </div>
        </div>

        {allUsersLoading ? (
          <div className="flex h-full w-full flex-row items-center justify-center">
            Loading ...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-neutral-600">
                  Name
                </TableHead>
                <TableHead className=" w-[76px] text-neutral-600">
                  Department
                </TableHead>
                <TableHead className=" w-[76px] text-neutral-600">
                  Role
                </TableHead>
                <TableHead className="w-[76px] text-right text-neutral-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchedUsers?.map(
                (user: any) =>
                  user.role !== ROLES.SUPER_ADMIN &&
                  user.department &&
                  (selDepartments.includes("All") ||
                    selDepartments.includes(user?.department?.code)) && (
                    <TableRow key={user._id}>
                      <TableCell className="w-[437px]">
                        <div className="flex flex-row items-center justify-start gap-3">
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt={`Photo of ${user?.username}`}
                              className=" w-10 rounded-full"
                            />
                          ) : (
                            <span className="text-[40px] text-neutral-500">
                              <FaCircleUser />
                            </span>
                          )}
                          <div className=" flex flex-col items-start justify-center">
                            <h1 className=" text-[16px] font-semibold">
                              {user?.username}
                              {profile?._id === user._id && " (You)"}
                            </h1>
                            <p>{user?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-600 w-10 text-neutral-500">
                        {user?.department?.code}
                      </TableCell>
                      <TableCell className="w-[76px] ">
                        {profile?.permissions.includes(
                          PERMISSIONS.UPDATE_USER,
                        ) && profile?._id !== user._id ? (
                          <Select
                            value={user?.role}
                            onValueChange={(val) => {
                              let newSearchedUsers = [...searchedUsers];
                              newSearchedUsers = newSearchedUsers.map(
                                (user) => {
                                  if (user.email === getUserValues("email")) {
                                    return {
                                      ...user,
                                      role: val,
                                    };
                                  }
                                  return user;
                                },
                              );
                              setSearchedUsers(newSearchedUsers);
                              setUpdatingUserData({
                                ...user,
                                role: val,
                              });
                              setChangeRoleVerificationModalOpen(true);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="STAFF">Officer</SelectItem>
                              <SelectItem value="DEPARTMENT_ADMIN">
                                Head of Department
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className=" flex flex-col items-start justify-center">
                            <p>
                              {user.role === ROLES.STAFF
                                ? "Officer"
                                : "Head of Department"}
                            </p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="w-[76px] text-right">
                        <div className="flex flex-row items-center justify-end gap-2">
                          {profile?.permissions.includes(
                            PERMISSIONS.UPDATE_USER,
                          ) &&
                            profile?._id !== user._id && (
                              <button
                                onClick={() => {
                                  resetUserForm({
                                    email: user?.email,
                                    username: user?.username,
                                    role: user?.role,
                                    department: user?.department?._id,
                                    permissions: user?.permissions,
                                  });
                                  setEditUserDialogOpen(true);
                                }}
                                className=" text-xl text-primary-600"
                              >
                                <MdOutlineEdit />
                              </button>
                            )}

                          {profile?.permissions.includes(
                            PERMISSIONS.DELETE_USER,
                          ) &&
                            profile?._id !== user._id && (
                              <button
                                onClick={() => {
                                  setUpdatingUserData(user);
                                  setDeleteUserDialogOpen(true);
                                }}
                                className=" text-xl text-red-700"
                              >
                                <MdDelete />
                              </button>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
