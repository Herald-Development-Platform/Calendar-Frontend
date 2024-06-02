"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
export default function Oauth() {
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
  }, []);
  return <div>Google Page...</div>;
}
