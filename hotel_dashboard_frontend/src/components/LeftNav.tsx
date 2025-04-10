"use client";

import Image from "next/image";
import { HomeIcon } from "./svgs/HomeIcon";
import { useDashboardState } from "@/store/useDashboardStore";

export function LeftNav() {
  const { dashboardViewState, setDashboardViewState } = useDashboardState();
  const handleNavClick = () => {
    if (dashboardViewState !== "RoomList") setDashboardViewState("RoomList");
  };
  return (
    <nav className="fixed top-0 left-0 w-[200px] h-screen bg-hugo-dark-gray">
      <div className="mb-8 p-6">
        <Image
          src={"/assets/hugo_logo.png"}
          alt="Logo for The Hugo hotel"
          width={160.23}
          height={58}
          priority
        />
      </div>
      <ul className="flex flex-row items-center justify-center">
        <li className="w-full border-s-4 border-hugo-red  ">
          <button
            className="text-hugo-light-gray text-sm flex items-center gap-x-2 pl-3.5 cursor-pointer"
            type="button"
            onClick={handleNavClick}
          >
            <HomeIcon className="size-4.5" />{" "}
            {dashboardViewState !== "RoomList" ? "Rooms" : "Room list"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
