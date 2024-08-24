"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiOutlineDollar } from "react-icons/ai";

const menuItems = [
  { name: "Dashboard", path: "/", icon: AiOutlineDollar },
  { name: "Transactions", path: "/transactions", icon: AiOutlineDollar },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <nav className="flex-1 p-4">
        <ul>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.name} className="mb-4">
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center justify-start py-2 px-3 gap-3 rounded",
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  )}
                >
                  <item.icon className="text-xl" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
