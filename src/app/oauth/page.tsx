"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
export default function Oauth() {
  const { accessToken } = useParams();
  const router = useRouter();
  useEffect(() => {
    if (typeof accessToken === "string") {
      Cookies.set("calToken", accessToken);
      router.push("/");
    }
  }, []);
  return <div>Google Page...</div>;
}
