import React from "react";
import Image from "next/image";

import logo from "@/assets/logo.png";

export default function Navbar() {
  return (
    <div className="w-full flex justify-between px-5 py-2 bg-slate-100">
      <div className="flex items-center gap-x-2">
        <Image src={logo} alt="logo" width={50} height={50} />
        <h1 className="font-bold text-2xl">HSE ADMIN</h1>
      </div>
    </div>
  );
}
