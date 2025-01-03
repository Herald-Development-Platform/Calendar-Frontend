"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import Cookies from "js-cookie";
import LoadingBar from "@/components/Loading";
import Link from "next/link";
import { BsBack } from "react-icons/bs";
import { MoveLeft } from "lucide-react";

export default function Page() {
  console.log("Oauth Page");
  return (
    <Suspense fallback={<LoadingBar />}>
      <Oauth />
    </Suspense>
  );
}

function Oauth() {
  const searchParams = useSearchParams();
  const token = searchParams.get("access_token");
  const error = searchParams.get("error") || "";
  const router = useRouter();
  useEffect(() => {
    if (typeof token === "string") {
      Cookies.set("token", token, {
        expires: 60
      });
      router.push(`/`);
    }
  }, [token]);
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      {error?.toString()?.length > 0 ? (
        <div className="flex flex-col items-center gap-6">
          <p className="max-w-[50vw] text-wrap text-center text-xl font-bold text-red-400">
            {error}
          </p>
          <div>
            <Link href="/login" className="font-bold text-primary-400 flex items-center gap-3">
              <MoveLeft />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex w-[50%] flex-col items-center justify-center gap-2">
          <span className="text-2xl font-semibold text-neutral-700">
            Logging In With Google
          </span>
          <LoadingBar className="h-2 w-[100%] bg-neutral-300" />
        </div>
      )}
    </div>
  );
}
