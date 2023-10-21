"use client";
import Image from "next/image";
export default function Sidebar() {
  const sidebarItems = [
    {
      name: "Home",
      iconLocation: "/images/Sidebar/Home.png",
      iconAlternative: "HomeIcon",
    },
    {
      name: "Search",
      iconLocation: "/images/Sidebar/Search.png",
      iconAlternative: "SearchIcon",
    },
  ];
  return (
    <div className="relative h-screen w-60 bg-neutral-50 px-4 py-10">
      <div className="flex h-screen w-[213px] flex-col items-center gap-16  font-medium">
        <div className="flex gap-3 text-lg text-neutral-600 ">
          <Image
            width={32}
            height={32}
            src={"/images/LoginPage/HeraldLogo.png"}
            alt="HeraldLogo"
          />
          Calendar
        </div>

        <div className="w-full">
          {sidebarItems.map((item, i) => (
            <button
              onClick={() => console.log("clicked")}
              className="flex h-11 w-full items-center gap-2 rounded px-3 text-neutral-500 focus:bg-primary-100"
              key={i}
            >
              <Image
                width={"18"}
                height={"18"}
                className="h-[18px] w-[18px]"
                src={item.iconLocation}
                alt={item.iconAlternative}
              />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => console.log("clicked")}
        className="absolute bottom-10 flex h-11 w-[213px] items-center gap-2 rounded px-3 text-neutral-500 focus:bg-primary-100"
      >
        <Image
          width={"18"}
          height={"18"}
          className="h-[18px] w-[18px]"
          src={"/images/Sidebar/HelpIcon.png"}
          alt={"Help and Support"}
        />
        <span>Help and Support</span>
      </button>
    </div>
  );
}
