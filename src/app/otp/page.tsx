"use client";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { baseUrl } from "@/services/baseUrl";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { set } from "date-fns";
import { LoaderCircle } from "lucide-react";
import HeraldLogo from "@/imgs/images/heraldLogo.svg";

export default function _Suspense() {
  return (
    <Suspense fallback={<div>Loding...</div>}>
      <OTP></OTP>
    </Suspense>
  );
}

function OTP() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { register, setValue, handleSubmit } = useForm<any>();

  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const forgetPassword = searchParams.get("forgetPassword");

  const verifyOtp = (payload: any) => {
    const otp = `${payload.otp1}${payload.otp2}${payload.otp3}${payload.otp4}${payload.otp5}${payload.otp6}`;
    if (!email || !otp) {
      toast.error("Email and OTP is required");
      return;
    }
    if (forgetPassword) {
      setIsLoading(true);
      fetch(`${baseUrl}/validateResetPasswordOTP?email=${email}&OTP=${otp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            toast.error(data.message || "Something went wrong");
            setIsLoading(false);
            return;
          }
          toast.success(data.message || "OTP verified successfully");
          setIsLoading(false);
          setTimeout(() => {
            router.push(`/resetPassword?email=${email}&OTP=${otp}`);
          }, 200);
        });
      return;
    }
    setIsLoading(true);
    fetch(`${baseUrl}/verifyOtp?email=${email}&OTP=${otp}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          setIsLoading(false);
          toast.error(data.message || "Something went wrong");
          return;
        }
        toast.success(data.message || "OTP verified successfully");
        setIsLoading(false);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      })
      .catch(err => {});
  };

  const handleOTPChange = (e: any) => {
    const otpNumber = e.target.getAttribute("name")?.replace("otp", "");
    if (parseInt(otpNumber) < 6 && e.target.value.length === 1) {
      e.target.nextSibling.focus();
    } else if (parseInt(otpNumber) > 1 && e.target.value.length === 0) {
      e.target.previousSibling.focus();
    } else if (parseInt(otpNumber) === 6 && e.target.value.length === 1) {
      handleSubmit(verifyOtp)();
    }
  };

  const handleOtpPaste = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    if (!navigator.clipboard) {
      return toast.error("Cannot access clipboard");
    }
    navigator.clipboard.readText().then(text => {
      text = text.trim();
      if (text.length > 6) {
        for (let i = 1; i <= 6; i++) {
          setValue(`otp${i}`, "");
        }
        return toast.error("Cannot paste more than 6 characters");
      }
      if (text.length === 6) {
        const otp = text.split("");
        otp.forEach((value, index) => {
          setValue(`otp${index + 1}`, value);
        });
        handleSubmit(verifyOtp)();
      }
    });
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
          className="flex h-20 w-auto flex-col items-center gap-[6px] px-4 "
          style={{ marginTop: 100.3 }}
        >
          <h1 className="text-2xl font-bold">OTP Verification</h1>
          <h4 className=" text-neutral-500">We&apos;ve sent a 6 digit OTP in your gmail</h4>
        </div>

        {/* Form  */}
        <form onSubmit={handleSubmit(verifyOtp)} className="flex flex-col gap-4">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <input
              type="text"
              className="input h-[40px] w-[40px] bg-neutral-100 text-sm text-neutral-800"
              style={{
                backgroundColor: "",
                borderRadius: "6px",
                outlineColor: "transparent",
                paddingLeft: 8,
                paddingRight: 8,
                fontSize: 24,
                textAlign: "center",
              }}
              onPaste={handleOtpPaste}
              {...register("otp1", {
                required: "OTP is required",
                onChange: handleOTPChange,
              })}
            />
            <input
              type="text"
              className="input h-[40px] w-[40px] bg-neutral-100 text-sm text-neutral-800"
              style={{
                borderRadius: "6px",
                outlineColor: "transparent",
                paddingLeft: 8,
                paddingRight: 8,
                fontSize: 24,
                textAlign: "center",
              }}
              onPaste={handleOtpPaste}
              {...register("otp2", {
                required: "OTP is required",
                onChange: handleOTPChange,
              })}
            />
            <input
              type="text"
              className="input h-[40px] w-[40px] bg-neutral-100 text-sm text-neutral-800"
              style={{
                backgroundColor: "",
                borderRadius: "6px",
                outlineColor: "transparent",
                paddingLeft: 8,
                paddingRight: 8,
                fontSize: 24,
                textAlign: "center",
              }}
              onPaste={handleOtpPaste}
              {...register("otp3", {
                required: "OTP is required",
                onChange: handleOTPChange,
              })}
            />
            <input
              type="text"
              className="input h-[40px] w-[40px] bg-neutral-100 text-sm text-neutral-800"
              style={{
                backgroundColor: "",
                borderRadius: "6px",
                outlineColor: "transparent",
                paddingLeft: 8,
                paddingRight: 8,
                fontSize: 24,
                textAlign: "center",
              }}
              onPaste={handleOtpPaste}
              {...register("otp4", {
                required: "OTP is required",
                onChange: handleOTPChange,
              })}
            />
            <input
              type="text"
              className="input h-[40px] w-[40px] bg-neutral-100 text-sm text-neutral-800"
              style={{
                backgroundColor: "",
                borderRadius: "6px",
                outlineColor: "transparent",
                paddingLeft: 8,
                paddingRight: 8,
                fontSize: 24,
                textAlign: "center",
              }}
              onPaste={handleOtpPaste}
              {...register("otp5", {
                required: "OTP is required",
                onChange: handleOTPChange,
              })}
            />
            <input
              type="text"
              className="input h-[40px] w-[40px] bg-neutral-100 text-sm text-neutral-800"
              style={{
                backgroundColor: "",
                borderRadius: "6px",
                outlineColor: "transparent",
                paddingLeft: 8,
                paddingRight: 8,
                fontSize: 24,
                textAlign: "center",
              }}
              onPaste={handleOtpPaste}
              {...register("otp6", {
                required: "OTP is required",
                onChange: handleOTPChange,
              })}
            />
          </div>
          <div className="space-y-4" style={{ marginTop: 40 }}>
            <button className="btn flex w-full gap-2 rounded-[4px] bg-primary-500 text-sm text-primary-50 hover:bg-primary-400">
              Verify {isLoading && <LoaderCircle className="animate-spin" />}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
