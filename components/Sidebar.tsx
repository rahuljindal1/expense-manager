"use client";

import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", path: "/", icon: DashboardCustomizeOutlinedIcon },
  {
    name: "Transactions",
    path: "/transactions",
    icon: SwapHorizOutlinedIcon,
  },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col">
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
