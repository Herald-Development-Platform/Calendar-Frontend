"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function page() {
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  return (
    <>
      <div className=" mx-[390px] my-[182px] flex h-[660px] w-[660px] flex-col items-center gap-8 border-[0.6px] border-neutral-300 font-medium">
        {/* Logo  */}
        <div className="flex -translate-y-1/2 transform items-center justify-between gap-2 bg-[#FFFFFF]">
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
        <div className="flex h-20 w-52 flex-col items-center gap-2 px-4 py-2 ">
          <h1 className="text-2xl font-bold">Login</h1>
          <h4 className=" text-neutral-500">Login to your account</h4>
        </div>

        {/* Form  */}
        <div className="flex flex-col gap-8">
          <label htmlFor="email">
            Email
            <br />
            <div className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100 px-4 ">
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
              />
            </div>
          </label>

          <label htmlFor="password">
            Password
            <br />
            <div className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
              <Image
                src={"/images/LoginPage/PasswordLogo.png"}
                width={"20"}
                height={"20"}
                alt="passwordLogo"
              />
              <input
                type="password"
                id="password"
                className="w-full bg-neutral-100  font-normal text-neutral-500 outline-none "
                placeholder="Enter your college id."
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

          <button className="btn w-full rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400">
            Login
          </button>
        </div>
      </div>
    </>
  );
}
