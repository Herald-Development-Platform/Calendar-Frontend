"use client";
import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Axios, baseUrl } from "@/services/baseUrl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

export default function Page() {

  const router = useRouter();
  const { register, handleSubmit } = useForm<any>();

  const { mutate: forgetPasswordMutation } = useMutation({
    mutationFn: async (payload: any) => {
      return Axios.post(`/forgetPassword`, payload);
    },
    mutationKey: ["forgetPassword"],
    onSuccess: (response) => {
        console.log(response);
      if (!response.data.success) {
        toast.error(response.data.message || "Something went wrong.");
        return;
      }
      toast.success(response.data.message || "Reset OTP sent to your email.");
      router.push(`/otp?email=${response.data.data}&forgetPassword=true`);
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  });

  const forgetPassword = (payload: any) => {
    forgetPasswordMutation(payload);
  };

  return (
    <>
      <div className="relative mx-auto my-[60px] flex h-auto w-[660px] flex-col items-center gap-3 border-[0.6px] border-neutral-300 pb-[84px] pt-12 font-medium">
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

        <h1 className="text-2xl font-bold">Send OTP</h1>
        <form
          onSubmit={handleSubmit(forgetPassword)}
          className="flex flex-col gap-8"
        >
          <label htmlFor="email">
            <br />
            <div className="flex h-[52px] w-full items-center gap-2 rounded-[4px] bg-neutral-100 px-4 ">
              <Image
                src={"/images/LoginPage/EmailLogo.png"}
                width={"20"}
                height={"20"}
                alt="emailLogo"
                className="h-[20px]"
              />
              <input
                type="email"
                className="w-full bg-neutral-100 font-normal text-neutral-500 outline-none"
                placeholder="Your college email."
                id="email"
                {...register("email", { required: "Email is required" })}
              />
            </div>
          </label>
          <div className="space-y-4">
            <button
              onClick={(e) => {}}
              className="btn w-full rounded-[4px] bg-primary-500 text-sm text-white hover:bg-primary-700"
            >
              Send OTP
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
