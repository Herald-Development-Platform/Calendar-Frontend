"use client";
import Endpoints from "@/services/API_ENDPOINTS";
import { Axios } from "@/services/baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Headers from "@/components/Header";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineUsers, HiArrowNarrowUp } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import { FaPlus, FaPowerOff } from "react-icons/fa6";
const { useRouter } = require("next/navigation");
import { postDepartment } from "@/services/api/departments";
import { useForm } from "react-hook-form";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { BiPencil } from "react-icons/bi";
import { PiClockUserBold } from "react-icons/pi";

import { Context } from "@/app/clientWrappers/ContextProvider";
import { profile } from "console";
import { ROLES } from "@/constants/role";
import { PERMISSIONS, READABLE_PERMISSIONS } from "@/constants/permissions";
import { useGetEvents } from "@/services/api/eventsApi";
import Image from "next/image";
import {
  MdImportExport,
  MdOutlineChangeCircle,
  MdOutlineModeEdit,
} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbCloudUpload } from "react-icons/tb";
import axios from "axios";
import Link from "next/link";
import { GrLocationPin } from "react-icons/gr";

export default function ManageDepartment() {
  const router = useRouter();
  const { userData } = useContext(Context);
  const queryClient = useQueryClient();

  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [updateProfileDialogOpen, setUpdateProfileDialogOpen] = useState(false);
  const [permissionsExpanded, setPermissionsExpanded] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<File>();

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => {
      return Axios.patch(Endpoints.updateProfile, data);
    },
    mutationKey: ["updateProfile"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setUpdateProfileDialogOpen(false);
      setUploadedImage(undefined);
      toast.success("Profile updated successfully");
    },
  });
  const changePasswordMutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => {
      return Axios.post(Endpoints.changePassword, data);
    },
    mutationKey: ["changePassword"],
    onSuccess: (data) => {
      setChangePasswordModalOpen(false);
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response.data.message
          ? error.response?.data.message
          : "An error occurred",
      );
    },
  });

  const {
    register: changePasswordRegister,
    handleSubmit: handleChangePasswordSubmit,
  } = useForm();

  const {
    register: updateProfileRegister,
    handleSubmit: handleUpdateProfileSubmit,
    reset: resetUpdateProfileForm,
  } = useForm({
    defaultValues: {
      photo: userData?.photo,
    },
  });

  useEffect(() => {
    if (userData) {
      setProfileData({ ...userData });
    }
  }, [userData]);

  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append("file", uploadedImage as File);
    formData.append("upload_preset", "calendar");
    const cloudinaryResponse = await axios.post(
      Endpoints.uploadToCloudinary,
      formData,
    );
    const photoUrl = cloudinaryResponse.data.secure_url;

    updateProfileMutation.mutate({ photo: photoUrl });
  };

  return (
    <>
      <Headers.GeneralHeader />
      <div className="ml-10 flex flex-col gap-6 max-h-[100vh] h-[100vh] overflow-y-scroll">
        <Dialog
          open={updateProfileDialogOpen}
          onOpenChange={setUpdateProfileDialogOpen}
        >
          <DialogContent className="gap-10">
            <h1 className="w-full text-left text-[20px] font-semibold text-neutral-900">
              Update Profile Picture
            </h1>
            <div className="flex flex-row items-center justify-center gap-6">
              {uploadedImage ? (
                <Image
                  alt={"profile pic"}
                  className="max-h-[84px] min-h-[84px] min-w-[84px] max-w-[84px] rounded-full"
                  src={URL.createObjectURL(uploadedImage)}
                  width={128}
                  height={128}
                />
              ) : profileData?.photo ? (
                <Image
                  alt={"profile pic"}
                  className="max-h-[84px] min-h-[84px] min-w-[84px] max-w-[84px] rounded-full"
                  src={profileData?.photo}
                  width={128}
                  height={128}
                />
              ) : (
                <span className=" flex h-[84px] w-[84px] items-center justify-center rounded-full bg-neutral-300 text-3xl font-semibold text-neutral-50">
                  {profileData?.username.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="relative flex h-[105px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#D0D5DD] bg-primary-50 ">
                <input
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedImage(e.target.files[0]);
                    }
                  }}
                  className="absolute left-0 top-0 h-full w-full cursor-pointer bg-red-300 opacity-0"
                  type="file"
                  accept="image/*"
                  multiple={false}
                />
                <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
                  <span
                    className={`h-[24px] w-[24px] text-xl text-primary-600`}
                  >
                    <TbCloudUpload />
                  </span>
                  <p className="text-center text-[13px] font-normal text-neutral-500">
                    Browse and choose the image you want to upload from your
                    device
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center">
              <button
                onClick={() => {
                  if (uploadedImage) {
                    handleSaveProfile();
                  }
                }}
                className=" btn btn-md h-5 w-full border-none bg-primary-600 text-[11px] font-medium text-primary-50 hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={changePasswordModalOpen}
          onOpenChange={setChangePasswordModalOpen}
        >
          <DialogContent>
            <form
              className="flex flex-col gap-7 p-6 py-2"
              onSubmit={handleChangePasswordSubmit((data) => {
                if (data.newPassword !== data.confirmNewPassword) {
                  toast.error("Passwords do not match");
                  return;
                }
                changePasswordMutation.mutate({
                  oldPassword: data.oldPassword,
                  newPassword: data.newPassword,
                });
              })}
            >
              <h1 className=" w-full text-center text-[20px] font-bold">
                Change Password
              </h1>
              <div className="flex flex-col gap-6">
                <label htmlFor="password" className="font-semibold">
                  Current Password
                  <br />
                  <div className="flex h-[52px] w-full items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
                    <Image
                      src={"/images/LoginPage/PasswordLogo.png"}
                      width={"20"}
                      height={"20"}
                      alt="passwordLogo"
                    />
                    <input
                      type="password"
                      className="w-full bg-neutral-100 font-normal text-neutral-500 outline-none "
                      placeholder="Current password."
                      {...changePasswordRegister("oldPassword")}
                    />
                  </div>
                </label>
                <label htmlFor="password" className="font-semibold">
                  New Password
                  <br />
                  <div className="flex h-[52px] w-full items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
                    <Image
                      src={"/images/LoginPage/PasswordLogo.png"}
                      width={"20"}
                      height={"20"}
                      alt="passwordLogo"
                    />
                    <input
                      type="password"
                      className="w-full bg-neutral-100 font-normal text-neutral-500 outline-none "
                      placeholder="New Password"
                      {...changePasswordRegister("newPassword", {
                        required: "New Password is required",
                      })}
                    />
                  </div>
                </label>
                <label htmlFor="password" className="font-semibold">
                  Confirm Password
                  <br />
                  <div className="flex h-[52px] w-full items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
                    <Image
                      src={"/images/LoginPage/PasswordLogo.png"}
                      width={"20"}
                      height={"20"}
                      alt="passwordLogo"
                    />
                    <input
                      type="password"
                      className="w-full bg-neutral-100 font-normal text-neutral-500 outline-none "
                      placeholder="Confirm password"
                      {...changePasswordRegister("confirmNewPassword", {
                        required: "Confirm Password",
                      })}
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  className="btn w-full rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400"
                >
                  Change Password
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        
        <div className="flex flex-row items-center justify-start gap-2">
          <span
            onClick={() => {
              router.back();
            }}
            className="cursor-pointer text-4xl font-bold text-neutral-600"
          >
            <IoMdArrowBack />
          </span>
          <p className="text-[28px] font-semibold text-neutral-700">Profile</p>
        </div>
        <div className="flex flex-col items-start justify-start gap-4">
          <div className="flex flex-row items-center justify-start gap-2.5">
            <div className="group relative flex items-center justify-center rounded-full">
              <div
                onClick={() => {
                  setUpdateProfileDialogOpen(true);
                }}
                className=" absolute left-0 top-0  hidden h-full w-full cursor-pointer items-center justify-center rounded-full bg-[rgba(0,0,0,0.3)] text-2xl text-neutral-900 group-hover:flex"
              >
                <MdOutlineModeEdit />
              </div>
              {profileData?.photo ? (
                <Image
                  alt={"profile pic"}
                  className="max-h-[84px] min-h-[84px] min-w-[84px] max-w-[84px] rounded-full"
                  src={profileData?.photo}
                  width={84}
                  height={84}
                />
              ) : (
                <span className=" flex h-[84px] w-[84px] items-center justify-center rounded-full bg-neutral-300 text-3xl font-semibold text-neutral-50">
                  {profileData?.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col items-start justify-center gap-2">
              <p className="text-[16px] font-semibold text-neutral-600">
                {profileData?.username}
              </p>
              <p className=" pl-[1px] text-[12px] font-normal text-neutral-600">
                {profileData?.email}
              </p>
              <div
                className={`flex h-[12px] items-center justify-center rounded-[20px] border-[0.5px] border-[#D4D4D4] bg-neutral-100 px-4  py-3 text-[14px] text-neutral-500 `}
              >
                <span className="flex h-full items-center justify-center">
                  {profileData?.role === ROLES.SUPER_ADMIN
                    ? "Super Admin"
                    : profileData?.department?.code}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-5">
            {profileData &&
              profileData.permissions &&
              profileData.permissions.length > 0 && (
                <>
                  <span className="text-[16px] font-semibold text-neutral-800">
                    Permissions
                  </span>
                  <div className="mt-2 flex flex-col items-start justify-start gap-2.5">
                    {profileData?.permissions
                      ?.slice(
                        0,
                        permissionsExpanded
                          ? profileData.permissions.length
                          : profileData?.permissions.length < 2
                            ? profileData?.permissions.length
                            : 2,
                      )
                      .map((permission: string) => (
                        <div
                          key={permission}
                          className={`flex items-center justify-start gap-2.5`}
                        >
                          <span className=" text-primary-500">•</span>
                          <span className="text-[14px] font-normal text-neutral-600">
                            {(READABLE_PERMISSIONS as any)[permission]}
                          </span>
                        </div>
                      ))}
                    {!permissionsExpanded &&
                      profileData?.permissions.length > 2 && (
                        <span
                          className=" cursor-pointer text-[11px] font-semibold text-info-600"
                          onClick={() => {
                            setPermissionsExpanded(true);
                          }}
                        >
                          + {profileData?.permissions.length - 2} more
                        </span>
                      )}
                    {permissionsExpanded && (
                      <span
                        className=" cursor-pointer text-[11px] font-semibold text-info-600"
                        onClick={() => {
                          setPermissionsExpanded(false);
                        }}
                      >
                        Show Less
                      </span>
                    )}
                  </div>
                </>
              )}
            <div className=" flex w-[40vw] cursor-pointer flex-col items-start justify-start gap-6">
              <div
                onClick={() => {
                  setChangePasswordModalOpen(true);
                }}
                className="flex w-full flex-row items-center justify-start gap-4 rounded-md bg-neutral-100 px-3 py-1.5"
              >
                <div className=" flex h-11 w-11 items-center justify-center rounded-md bg-neutral-200 text-[20px] text-neutral-400">
                  <MdOutlineChangeCircle />
                </div>
                <span className="text-[16px] font-semibold text-neutral-900">
                  Change Password
                </span>
              </div>
              <Link
                href={"/semesters"}
                className="flex w-full flex-row items-center justify-start gap-4 rounded-md bg-neutral-100 px-3 py-1.5"
              >
                <div className=" flex h-11 w-11 items-center justify-center rounded-md bg-neutral-200 text-[20px] text-neutral-400">
                  <PiClockUserBold />
                </div>
                <span className="text-[16px] font-semibold text-neutral-900">
                  Semesters
                </span>
              </Link>
              <Link
                href={"/location"}
                className="flex w-full flex-row items-center justify-start gap-4 rounded-md bg-neutral-100 px-3 py-1.5"
              >
                <div className=" flex h-11 w-11 items-center justify-center rounded-md bg-neutral-200 text-[20px] text-neutral-400">
                  <GrLocationPin />
                </div>
                <span className="text-[16px] font-semibold text-neutral-900">
                  Location
                </span>
              </Link>
              <Link
                href={"/importExport"}
                className="flex w-full flex-row items-center justify-start gap-4 rounded-md bg-neutral-100 px-3 py-1.5"
              >
                <div className=" flex h-11 w-11 items-center justify-center rounded-md bg-neutral-200 text-[20px] text-neutral-400">
                  <MdImportExport />{" "}
                </div>
                <span className="text-[16px] font-semibold text-neutral-900">
                  Import/Export
                </span>
              </Link>
              {profileData?.syncWithGoogle ? (
                <div className="flex w-full flex-row items-center justify-start gap-4 rounded-md bg-neutral-100 px-3 py-1.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-neutral-200 text-[20px] text-neutral-400">
                    <Image
                      src={`/images/google.logo.svg`}
                      alt="Google logo"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="flex flex-row gap-1">
                    <span className="text-[13px] font-semibold text-neutral-900">
                      Synced With
                    </span>
                    <span className="text-[13px] font-bold text-neutral-900">
                      {profileData?.email}
                    </span>
                  </div>
                  {/* <div className="ml-auto cursor-pointer" onClick={()=>{

                }}>
                  <BsThreeDots />
                </div> */}
                  <div className="ml-auto">
                    <Popover>
                      <PopoverTrigger>
                        <BsThreeDots />
                      </PopoverTrigger>
                      <PopoverContent
                        onClick={() => {
                          updateProfileMutation.mutate({
                            syncWithGoogle: false,
                          });
                        }}
                        align="start"
                        className="flex cursor-pointer flex-row items-center gap-1.5 px-5 py-4 text-danger-400 hover:bg-neutral-100"
                      >
                        <span className="text-xl">
                          <FaPowerOff />
                        </span>
                        <span className="text-[16px]">Turn Off Sync</span>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    updateProfileMutation.mutate({ syncWithGoogle: true });
                  }}
                  className="flex w-full cursor-pointer flex-row items-center justify-start gap-4 rounded-md bg-neutral-100 px-3 py-1.5"
                >
                  <div className=" flex h-11 w-11 items-center justify-center rounded-md bg-neutral-200 text-[20px] text-neutral-400">
                    <Image
                      src={`/images/google.logo.svg`}
                      alt="Google logo"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-[16px] font-semibold text-neutral-900">
                    Sync With Google
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
