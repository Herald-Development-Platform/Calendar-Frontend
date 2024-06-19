"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { baseUrl } from "@/services/baseUrl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as CookieHooks from "@/hooks/CookieHooks";
import Link from "next/link";

export default function Page() {
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
  } = useForm<any>();

  const loginUser = (payload: any) => {
    fetch(`${baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          toast.error(data.message || "Something went wrong.");
          return;
        }
        CookieHooks.setCookie("token", data.data, 1);
        toast.success(data.message || "Successfully registered user.");
        router.push("/");
      })
      .catch((err) => toast.error("Something went wrong"));
  };
  return (
    <>
      <div className="relative mx-auto my-[60px] flex h-auto w-[660px] flex-col items-center gap-8 border-[0.6px] border-neutral-300 pb-[84px] pt-12 font-medium">
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
                src={"/images/LoginPage/EmailLogo.png"}
                width={"20"}
                height={"20"}
                alt="emailLogo"
                className="h-[20px]"
              />
              <input
                type="email"
                className="w-full bg-neutral-100  font-normal text-neutral-500 outline-none"
                placeholder="Enter your college id."
                id="email"
                {...register("email", { required: "Email is required" })}
              />
            </div>
          </label>

          <label htmlFor="password">
            Password
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
                id="password"
                className="w-full bg-neutral-100 font-normal text-neutral-500 outline-none "
                placeholder="Enter your password."
                {...register("password", { required: "Password is required" })}
              />
            </div>
          </label>

          <div className="relative bottom-2 flex h-9 w-auto flex-row items-center gap-3">
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
          </div>
          <div className="space-y-4">
            <button className="btn w-full rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400">
              Login
            </button>
            <Link
              href={`${baseUrl}/googleAuth`}
              className="btn w-full rounded-[4px] bg-primary-50  text-sm  hover:bg-primary-100"
              type="button"
            >
              <Image
                src={"/images/LoginPage/GoogleIcon.png"}
                width={24}
                height={24}
                alt="GoogleIcon"
              ></Image>{" "}
              Continue With Google
            </Link>

            <button
              onClick={(e) => {e.preventDefault();router.push("/signup")}}
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
