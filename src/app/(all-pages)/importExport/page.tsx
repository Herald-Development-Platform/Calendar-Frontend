'use client';
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { TbCloudUpload,TbCloudDownload } from "react-icons/tb";


export default function ImportExport() {
    const [currentTab, setCurrentTab] = useState("import");
  return (
    <div className="flex flex-col gap-9 px-[70px] pl-9">
      <Toaster />
      <div className=" flex flex-col gap-[27px] mt-[80px]">
        <div className="flex flex-row justify-between">
            <h1 className=" text-[28px] text-neutral-700 font-[700]">Import/ Export</h1>
        </div>
        <div className="flex flex-row gap-4 items-center justify-start text-neutral-500">
            <span onClick={()=>{setCurrentTab("import")}} className={`${currentTab==="import"?"text-primary-700 underline underline-offset-4":""} cursor-pointer `}>Import</span>
            <span onClick={()=>{setCurrentTab("export")}} className={`${currentTab==="export"?"text-primary-700 underline underline-offset-4":""} cursor-pointer `}>Export</span>
        </div>
        <div className="w-full bg-primary-50 border border-dashed border-[#D0D5DD] h-[105px] rounded-[4px] flex items-center justify-center">
            <div className="w-[240px] gap-[10px] flex flex-col items-center cursor-pointer">
                <span className={`text-primary-600 text-xl w-[24px] h-[24px]`}>{currentTab==="import"?<TbCloudUpload/>:<TbCloudDownload/>}</span>
                <p className="font-normal text-[13px] text-neutral-500 text-center">Browse and choose the file you want to import from your device</p>
            </div>
        </div>

      </div>
    </div>
  )
}