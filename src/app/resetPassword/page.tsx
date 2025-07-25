"use client";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { baseUrl } from "@/services/baseUrl";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import HeraldLogo from "@/imgs/images/heraldLogo.svg";
import PasswordLogo from "@/imgs/images/LoginPage/PasswordLogo.png";

export default function Page() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}

function ResetPassword() {
  const router = useRouter();

  const { register: changePasswordRegister, handleSubmit: handleChangePasswordSubmit } = useForm();

  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const OTP = searchParams.get("OTP");
  if (!email || !OTP) {
    router.back();
    return <></>;
  }

  const resetPassword = (payload: any) => {
    if (!email || !OTP) {
      return router.back();
    }
    fetch(`${baseUrl}/resetPassword`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, OTP, password: payload.newPassword }),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          toast.error(data.message || "Something went wrong");
        }
        toast.success(data.message || "Password reset successfully.");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      })
      .catch(err => toast.error(err.message || "Something went wrong"));
  };

  return (
    <>
      <div className="relative mx-auto my-[60px] flex h-auto w-[660px] flex-col items-center gap-8 border-[0.6px] border-neutral-300 pb-[84px] pt-12 font-medium">
        {/* Logo  */}
        <div className="absolute top-0 flex -translate-y-1/2 transform items-center justify-between gap-2 bg-[#FFFFFF] px-3">
          <Image
            width="32"
            height="32"
            src={HeraldLogo}
            alt="HeraldLogo"
            className="h-auto w-auto"
          />
          <div className="text-2xl ">
            <span className="text-primary-600"> Herald </span>
            <span className="text-neutral-600">Calendar</span>
          </div>
        </div>

        {/* Title  */}
        <div
          className="flex w-auto flex-col items-center gap-[6px] px-4 "
          style={{ marginTop: 100.3 }}
        >
          <h1 className="text-2xl font-bold">Reset Password</h1>
        </div>

        {/* Form  */}
        <form onSubmit={handleChangePasswordSubmit(resetPassword)} className="flex flex-col gap-4">
          <label htmlFor="password">
            New Password
            <br />
            <div className="flex h-[52px] w-full items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
              <Image src={PasswordLogo} width={"20"} height={"20"} alt="passwordLogo" />
              <input
                type="password"
                id="password"
                className="w-full bg-neutral-100 font-normal text-neutral-500 outline-none "
                placeholder="Enter your password."
                {...changePasswordRegister("newPassword", {
                  required: "New Password is required",
                })}
              />
            </div>
          </label>
          <label htmlFor="password">
            Confirm Password
            <br />
            <div className="flex h-[52px] w-full items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
              <Image src={PasswordLogo} width={"20"} height={"20"} alt="passwordLogo" />
              <input
                type="password"
                id="password"
                className="w-full bg-neutral-100 font-normal text-neutral-500 outline-none "
                placeholder="Confirm password."
                {...changePasswordRegister("confirmPassword", {
                  required: "Confirm Password is required",
                })}
              />
            </div>
          </label>
          <div className="space-y-4" style={{ marginTop: 40 }}>
            <button className="btn w-full rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400">
              Verify
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
