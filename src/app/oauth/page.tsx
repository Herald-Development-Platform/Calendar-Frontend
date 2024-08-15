"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import Cookies from "js-cookie";
import LoadingBar from "@/components/Loading";

export default function Page() {
  return <Suspense fallback={<Oauth />}></Suspense>;
}

function Oauth() {
  const searchParams = useSearchParams();
  const token = searchParams.get("access_token");
  console.log("token", token);
  // console.log("accestoken", access_token);
  const router = useRouter();
  useEffect(() => {
    if (typeof token === "string") {
      Cookies.set("token", token);
      router.push("/");
    }
  }, [token]);
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="flex w-[50%] flex-col items-center justify-center gap-2">
        <span className="text-2xl font-semibold text-neutral-700">
          Logging In With Google
        </span>
        <LoadingBar className="h-2 w-[100%] bg-neutral-300" />
      </div>
    </div>
  );
}
