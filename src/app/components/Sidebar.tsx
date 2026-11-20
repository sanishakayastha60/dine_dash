"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import MenuOpenSharpIcon from "@mui/icons-material/MenuOpenSharp";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MicrowaveOutlinedIcon from "@mui/icons-material/MicrowaveOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import FoodBankOutlinedIcon from "@mui/icons-material/FoodBankOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PublicIcon from "@mui/icons-material/Public";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const menuItems = [
  {
    name: "Dashboard",
    href: "/business",
    icon: DashboardOutlinedIcon,
  },
  {
    name: "Restaurant Profile",
    href: "/business/profile",
    icon: MicrowaveOutlinedIcon,
  },
  {
    name: "Menu Management",
    href: "/business/menu",
    icon: MenuBookOutlinedIcon,
  },
  {
    name: "Food Categories",
    href: "/business/categories",
    icon: FoodBankOutlinedIcon,
  },
  {
    name: "Pickup Orders",
    href: "/business/orders",
    icon: AssignmentOutlinedIcon,
  },
  {
    name: "Reservations",
    href: "/business/reservations",
    icon: DateRangeOutlinedIcon,
  },
  {
    name: "Customer Reviews",
    href: "/business/reviews",
    icon: CommentOutlinedIcon,
  },
  {
    name: "Settings",
    href: "/business/settings",
    icon: SettingsOutlinedIcon,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <aside
      className={`sticky top-0 shrink-0 h-screen flex flex-col ${isOpen ? "w-[260px]" : "w-[72px]"}`}
    >
      {/* button section */}
      <div className="pb-4">
        {isOpen ? (
          <div className="px-2">
            <div className="flex justify-between p-2">
              <span className="">DineDash</span>
              <MenuOpenSharpIcon onClick={toggleSidebar} />
            </div>
            <div className="w-full h-1 rounded bg-gray-200 mt-2" />
          </div>
        ) : (
          <div
            className="border md:border-none rounded-full w-fit md:w-full p-2 pb-0 text-center"
            onClick={toggleSidebar}
          >
            <span className="hidden md:block font-bold text-xl">D</span>
            <span className="md:hidden">
              <MenuOutlinedIcon />
            </span>
          </div>
        )}
      </div>
      <nav>
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/business" &&
                pathname.startsWith(item.href + "/"));

            return (
              <li key={item.href} className="pt-2">
                <Link
                  href={item.href}
                  title={!isOpen ? item.name : undefined}
                  className={`
                    flex items-center gap-3
                    min-h-11 rounded-lg mx-2 px-2
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-[#872408] text-[#F3E8C8]"
                        : "text-[#000033] hover:bg-[#DCD8CC]"
                    }
                    ${!isOpen ? "justify-center" : ""}
                  `}
                >
                  <Icon sx={{ fontSize: 22, flexShrink: 0 }} />

                  {isOpen && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* logout customer */}
      <div className="shrink-0 border-t border-[#C9C1B0]">
        <Link
          href="/"
          title={!isOpen ? "Customer Site" : undefined}
          className={`
            flex items-center gap-3 rounded-lg mx-2 px-2 py-3
            text-[#000033] hover:bg-[#DCD8CC]
            transition-colors
            ${!isOpen ? "justify-center" : ""}
          `}
        >
          <PublicIcon sx={{ fontSize: 22, flexShrink: 0 }} />
          {isOpen && (
            <span className="text-sm font-medium whitespace-nowrap">
              Customer Site
            </span>
          )}
        </Link>

        <button
          type="button"
          title={!isOpen ? "Logout" : undefined}
          className={`
            w-full flex items-center gap-3 rounded-lg px-2 py-3
            text-[#872408] hover:bg-[#DCD8CC]
            transition-colors
            ${!isOpen ? "justify-center" : ""}
          `}
        >
          <LogoutOutlinedIcon sx={{ fontSize: 22, flexShrink: 0 }} />
          {isOpen && (
            <span className="text-sm font-medium whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
