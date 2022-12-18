import React from "react";
import Image from "next/image";
import {
  HiHome,
  HiStar,
  HiMicrophone,
  HiChartBar,
  HiClock,
  HiDotsHorizontal,
  HiQuestionMarkCircle
} from "react-icons/hi";
import { GiSoundWaves,
  GiConsoleController} from "react-icons/gi";


function Sidebar() {
  return (
    <section className="fixed top-0 z-40 flex flex-col p-4 items-center bg-black w-[90px] h-screen space-y-8 ">
      <Image
        src="https://rb.gy/xkacau"
        width={56}
        height={56}
        objectFit="contain"
      />
      <div className="flex flex-col space-y-7">
        <HiHome className="sidebarIcon text-green-400 opacity-[0.85]" />
        <HiStar className="sidebarIcon text-2xl" />
        <HiMicrophone className="sidebarIcon" />
        <HiChartBar className="sidebarIcon" />
        <HiClock className="sidebarIcon" />
        <HiQuestionMarkCircle className="sidebarIcon" />
        <GiSoundWaves className="sidebarIcon" />
        <GiConsoleController className="sidebarIcon" />
        <HiDotsHorizontal className="sidebarIcon" />
        
      </div>
    </section>
  );
}

export default Sidebar;
