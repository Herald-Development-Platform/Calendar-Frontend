"use client";
import React from "react";
import Image from "next/image";
import Input from "@/components/Input";

export default function page() {
  return (
    <>
      <div className="mx-[390px] my-[182px] flex h-[660px] w-[660px] flex-col items-center border-[0.6px] border-neutral-300">
        <div className="flex -translate-y-1/2 transform items-center justify-between gap-2 bg-[#FFFFFF]">
          <Image
            width="32"
            height="32"
            src={"/images/LoginPage/HeraldLogo.png"}
            alt="HeraldLogo"
          />
          <div className="text-2xl font-medium">
            <span className="text-primary-600"> Herald </span>
            <span className="text-neutral-600">Calendar</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Login</h1>
        <h4 className="font-medium text-neutral-500">Login to your account.</h4>

        <div>
          <label htmlFor="email" className="font-medium ">
            Email
          </label>
          <br />
          <label
            htmlFor="email"
            className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100 px-4 font-medium"
          >
            <Image
              src={"/images/LoginPage/EmailLogo.png"}
              width={"20"}
              height={"20"}
              alt="emailLogo"
              className="h-[20px]"
            />
            <input
              type="email"
              className="w-full bg-neutral-100 font-medium text-neutral-500 outline-none"
              placeholder="Enter your college id."
              id="email"
            />
          </label>
          <label htmlFor="password" className="font-medium ">
            Password
          </label>
          <br />
          <label className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
            <Image
              src={"/images/LoginPage/PasswordLogo.png"}
              width={"20"}
              height={"20"}
              alt="passwordLogo"
              className="h-5 w-5"
            />
            <input
              type="password"
              id="password"
              className="w-full bg-neutral-100 font-medium text-neutral-500 outline-none"
              placeholder="Enter your college id."
            />
          </label>
          {/* <input type="email" id="email" className="input" /> */}
          <div className="form-control w-52">
            <label className="label cursor-pointer">
              <span className="label-text">Remember me</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked
                onChange={() => {
                  console.log("toggle");
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
