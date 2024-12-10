"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { baseUrl } from "@/services/baseUrl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as CookieHooks from "@/hooks/CookieHooks";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { LoaderCircle } from "lucide-react";

import img1 from "@/images/images/LoginPage/GoogleIcon.png";

export default function Page() {
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginUser = (payload: any) => {
    setIsLoading(true);
    fetch(`${baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.remove();
        if (!data.success) {
          toast.error(data.message || "Something went wrong.");
          setIsLoading(false);
          return;
        }
        CookieHooks.setCookie("token", data.data, 1);
        toast.success(data.message || "Successfully registered user.");
        queryClient.invalidateQueries();
        router.push("/");
        setIsLoading(false);
      })
      .catch((err) => {
        toast.remove();
        toast.error(err.message || "Something went wrong");
        setIsLoading(false);
      });
  };
  return (
    <>
      <div className="relative mx-auto my-[60px] flex h-auto w-[660px] flex-col items-center gap-8 border-[0.6px] border-neutral-300 pb-[84px] pt-12 font-medium">
        {/* Logo  */}
        <div className="absolute top-0 flex -translate-y-1/2 transform items-end justify-between gap-2 bg-[#FFFFFF] px-3">
          <Image
            width="32"
            height="32"
            src={"/images/heraldLogo.svg"}
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
        <div className="flex h-20 w-auto flex-col items-center gap-[6px] px-4  ">
          <h1 className="text-2xl font-bold">Login</h1>
          <h4 className=" text-neutral-500">Login to your account</h4>
        </div>

        {/* Form  */}
        <form
          onSubmit={handleSubmit(loginUser)}
          className="flex flex-col gap-8"
        >
          <label htmlFor="email">
            Email
            <br />
            <div className="flex h-[52px] w-full items-center gap-2 rounded-[4px] bg-neutral-100 px-4 ">
              <Image
                src={"/images/atsymbol.svg"}
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
                {...register("email", { required: "Email is required" })}
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
            <div className="flex h-[52px] w-full items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
              <Image
                src={"/images/lockSymbol.svg"}
                width={"20"}
                height={"20"}
                alt="passwordLogo"
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full bg-neutral-100 font-normal text-neutral-500 outline-none "
                placeholder="Enter your password."
                {...register("password", { required: "Password is required" })}
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
          <div className="relative  flex w-auto flex-row items-center justify-end gap-3">
            <Link
              href={"/forgetPassword"}
              className="underline-offset-3 label cursor-pointer text-sm text-primary-500 underline decoration-primary-500 decoration-from-font"
            >
              <span className="">Forgot Password ?</span>
            </Link>
          </div>
          <div className="space-y-4">
            <button className="btn flex w-full gap-2 rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400">
              Login {isLoading && <LoaderCircle className="animate-spin" />}
            </button>
            <Link
              href={`${baseUrl}/googleAuth`}
              className="btn w-full rounded-[4px] bg-primary-50  text-sm  hover:bg-primary-100"
              type="button"
            >
              <Image src={img1} width={24} height={24} alt="img1" />
              <Image
                src={`${process.env.NEXT_PUBLIC_DOMAIN_PREFIX}/images/LoginPage/GoogleIcon.png`}
                width={24}
                height={24}
                alt="GoogleIcon"
              />
              Continue With Google
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/signup");
              }}
              className="btn w-full rounded-[4px] bg-primary-50  text-sm  hover:bg-primary-100"
            >
              Register New Account
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
