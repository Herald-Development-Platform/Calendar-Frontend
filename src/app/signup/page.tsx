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

export default function page() {
  const {
    register,
    setValue,
    reset,
    // formState: { error },
    getValues,
    handleSubmit,
  } = useForm<any>();

  const router = useRouter();

  const registerUser = (payload: any) => {
    fetch(`${baseUrl}/admin/register`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          throw Error(data || "Something went wrong");
        }
        router.push("/login");
        toast.success(data.message || "Successfully registered user.");
      })
      .catch((err) => toast.error(err.message || "Something went wrong"));
  };

  return (
    <>
      <div className="mx-auto my-[182px] flex w-[660px] flex-col items-center gap-8 border-[0.6px] border-neutral-300 pb-10 font-medium">
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
              <Image
                src={"/images/LoginPage/EmailLogo.png"}
                width={"20"}
                height={"20"}
                alt="emailLogo"
                className="h-[20px]"
              />
              <input
                type="username"
                className="w-full bg-neutral-100  font-normal text-neutral-500 outline-none"
                placeholder="Enter your username."
                id="username"
                {...register("username", { required: "Username is required" })}
              />
            </div>
          </label>
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
                {...register("email", { required: "Email is required" })}
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
                {...register("password", { required: "Password is required" })}
              />
            </div>
          </label>
          <label htmlFor="role">
            Role
            <br />
            <div className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100 ">
              <select
                {...register("role", { required: "Pick a Role" })}
                className="select w-full  bg-neutral-100 outline-none ring-0"
              >
                <option disabled selected>
                  Pick your role
                </option>
                {Object.values(ROLES).map((role, i) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label htmlFor="role">
            Department
            <br />
            <div className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100">
              <select
                {...register("department", { required: "Pick a Department" })}
                className="select w-full  bg-neutral-100"
              >
                <option disabled selected>
                  Pick your department
                </option>
                {Object.values(DEPARTMENTS).map((department, i) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
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
          <button className="btn w-full rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
