"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Axios, baseUrl } from "@/services/baseUrl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as CookieHooks from "@/hooks/CookieHooks";
import axios from "axios";
import Link from "next/link";

export default function Page() {
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const router = useRouter();
  const {
    register,
    setValue,
    reset,
    // formState: { error },
    getValues,
    handleSubmit,
  } = useForm<any>();

  const verifyOtp = (payload: any) => {
    fetch(`${baseUrl}/verifyOtp`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          throw Error(data || "Something went wrong");
        }
        CookieHooks.setCookie("token", data.data, 1);
        toast.success(data.message || "Successfully registered user.");
        router.push("/");
      })
      .catch((err) => toast.error(err.message || "Something went wrong"));
  };
  return (
    <>
      <div className="relative mx-auto my-[80px] flex h-auto w-[660px] flex-col items-center gap-8 border-[0.6px] border-neutral-300 pb-[84px] pt-12 font-medium">
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
        <div
          className="flex h-20 w-auto flex-col items-center gap-[6px] px-4 "
          style={{ marginTop: 100.3 }}
        >
          <h1 className="text-2xl font-bold">OTP Verification</h1>
          <h4 className=" text-neutral-500">
            We’ve sent a 4 digit OTP in your gmail
          </h4>
        </div>

        {/* Form  */}
        <form
          onSubmit={handleSubmit(verifyOtp)}
          className="flex flex-col gap-8"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              gap: 26,
            }}
          >
            <input
              type="text"
              placeholder="Enter OTP"
              className="input h-[40px] w-[150px] text-sm text-neutral-800"
              {...register("otp", { required: "OTP is required" })}
            />
            <input
              type="text"
              placeholder="Enter OTP"
              className="input h-[40px] w-[150px] text-sm text-neutral-800"
              {...register("otp", { required: "OTP is required" })}
            />
            <input
              type="text"
              placeholder="Enter OTP"
              className="input h-[40px] w-[150px] text-sm text-neutral-800"
              {...register("otp", { required: "OTP is required" })}
            />
            <input
              type="text"
              placeholder="Enter OTP"
              className="input h-[40px] w-[150px] text-sm text-neutral-800"
              {...register("otp", { required: "OTP is required" })}
            />
          </div>
          <div className="space-y-4">
            <button className="btn w-full rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400">
              Verify
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
