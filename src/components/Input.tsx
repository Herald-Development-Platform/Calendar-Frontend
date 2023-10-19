import React from "react";
import Image from "next/image";

export default function Input() {
  return (
    <label className="flex h-[52px] w-[430px] items-center gap-2 rounded-[4px] bg-neutral-100 px-4">
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
      />
    </label>
  );
}
