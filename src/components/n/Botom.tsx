import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Botom() {
  return (
    <>
      <div className="flex h-[687px] w-full flex-col gap-[65px] bg-[#141516] px-[88px] pb-[25px] pt-[45px] text-white">
        <div className="flex w-full flex-grow justify-between border border-red-500">
          <div className="h-full border border-blue-500">
            <div>
              <Image
                src="/images/LoginPage/HeraldLogo.png"
                alt="logo"
                width={204}
                height={122}
              />
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              <div>
                <Link
                  className="h-11 w-11 rounded-full bg-[#e6e8e9]"
                  href={"#"}
                ></Link>
              </div>
            </div>
            Lorem ipsum dolor sit.
          </div>
          <div className="flex justify-around gap-[68px]">
            <ul className="space-y-6">
              <h4 className="text-2xl font-bold leading-7">Solutions</h4>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Accounting and Software
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Inventory Management
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Retail POS
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Restaurant POS
              </li>
            </ul>
            <ul className="space-y-6">
              <h4 className="text-2xl font-bold leading-7">Solutions</h4>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Accounting and Software
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Inventory Management
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Retail POS
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Restaurant POS
              </li>
            </ul>
            <ul className="space-y-6">
              <h4 className="text-2xl font-bold leading-7">Solutions</h4>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Accounting and Software
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Inventory Management
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Retail POS
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Restaurant POS
              </li>
            </ul>
            <ul className="space-y-6">
              <h4 className="text-2xl font-bold leading-7">Solutions</h4>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Accounting and Software
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Inventory Management
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Retail POS
              </li>
              <li className="text-xl leading-[23px] text-[#dfdada]">
                Restaurant POS
              </li>
            </ul>
          </div>
        </div>
        <div className="h-[57px] w-full border border-blue-500"></div>
      </div>
    </>
  );
}
