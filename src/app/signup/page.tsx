/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/services/baseUrl";
import { useForm } from "react-hook-form";
import { ROLES } from "@/constants/role";
import { DEPARTMENTS } from "@/constants/departments";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { LoaderCircle } from "lucide-react";
import HeraldLogo from "@/imgs/images/heraldLogo.svg";
import atSymbol from "@/imgs/images/atsymbol.svg";
import lockSymbol from "@/imgs/images/lockSymbol.svg";
// import { error } from "console";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    setValue,
    reset,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm<any>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const registerUser = (payload: any) => {
    setIsLoading(true);
    fetch(`${baseUrl}/register`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setIsLoading(false);
          throw Error(data.message || "Something went wrong");
        }
        toast.success(data.message || "Successfully registered user.");
        setIsLoading(false);
        setTimeout(() => {
          router.push(`/otp?email=${payload.email}`);
        }, 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Something went wrong");
      });
  };

  return (
    <>
      <div className="mx-auto my-[60px] flex w-[660px] flex-col items-center gap-8 border-[0.6px] border-neutral-300 pb-10 font-medium">
        {/* Logo  */}
        <div className="flex -translate-y-1/2 transform items-end justify-between gap-2 bg-[#FFFFFF]">
          <Image
            width="32"
            height="32"
            src={HeraldLogo}
            alt="HeraldLogo"
            className="h-auto w-auto"
          />
          <div className="text-2xl" style={{ lineHeight: 0 }}>
            <span className="text-primary-600" style={{ lineHeight: 0.8 }}>
              Herald{" "}
            </span>
            <span className="text-neutral-600" style={{ lineHeight: 0.8 }}>
              Calendar
            </span>
          </div>
        </div>

        {/* Title  */}
        <div className="flex h-20 w-auto flex-col items-center gap-2 px-4 py-2 ">
          <h1 className="text-2xl font-bold">Register</h1>
          <h4 className=" text-neutral-500">Register your account</h4>
        </div>

        {/* Form  */}
        <form
          onSubmit={handleSubmit(registerUser)}
          className="flex flex-col gap-8"
        >
          <label htmlFor="username">
            Name
            <br />
            <div className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100 px-4 ">
              <span className="text-md text-neutral-500">
                <FaRegCircleUser />
              </span>
              <input
                type="username"
                className="w-full bg-neutral-100  font-normal text-neutral-500 outline-none"
                placeholder="Enter your username."
                id="username"
                {...register("username", {
                  required: "* Username is required",
                })}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-500">
                {errors.username.message as string}
              </p>
            )}
          </label>
          <label htmlFor="email">
            Email
            <br />
            <div className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100 px-4 ">
              <Image
                src={atSymbol}
                width={"20"}
                height={"20"}
                alt="emailLogo"
                className="h-[20px]"
              />
              <input
                type="email"
                className="w-full bg-neutral-100  font-normal text-neutral-500 outline-none"
                placeholder="Enter your college email"
                id="email"
                {...register("email", { required: "* Email is required" })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message as string}
              </p>
            )}
          </label>
          <label htmlFor="password">
            Password
            <br />
            <div className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
              <Image
                src={lockSymbol}
                width={"20"}
                height={"20"}
                alt="emailLogo"
                className="h-[20px]"
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full bg-neutral-100  font-normal text-neutral-500 outline-none "
                placeholder="Enter your password."
                {...register("password", {
                  required: "* Password is required",
                })}
              />
              <span
                className="cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </label>

          {/* <div className="relative bottom-2 flex h-9 w-auto flex-row items-center gap-3">
            <input
              type="checkbox"
              className="toggle-primary-600 toggle toggle-xs checked:bg-primary-600"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              id="checkbox"
            />
            <label
              htmlFor="checkbox"
              className="label cursor-pointer text-base text-neutral-500"
            >
              <span className="">Remember me</span>
            </label>
          </div> */}
          <button className="btn flex w-full gap-2 rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400">
            Register {isLoading && <LoaderCircle className="animate-spin" />}
          </button>
        </form>
      </div>
    </>
  );
}
