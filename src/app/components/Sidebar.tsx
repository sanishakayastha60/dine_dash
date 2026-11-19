"use client";
import { useState } from "react";
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
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div
      className={`relative min-h-screen p-4 w-full md:w-64 ${isOpen ? "md:border-r" : "border-none"}`}
    >
      {/* button section */}
      <div className="pb-4">
        {isOpen ? (
          <div className="px-2">
            <div className="flex justify-between">
              <span className="">DineDash</span>
              <MenuOpenSharpIcon onClick={toggleSidebar} />
            </div>
            <div className="w-full h-1 rounded bg-gray-200 mt-2" />
          </div>
        ) : (
          <div
            className="border rounded-full w-fit p-2"
            onClick={toggleSidebar}
          >
            <MenuOutlinedIcon />
          </div>
        )}
      </div>
      {isOpen && (
        <div>
          {/* menu board */}
          <div>
            <ul className="flex flex-col gap-4">
              <li>
                <button className="flex gap-2 w-full hover:bg-orange-400/40 p-2 rounded-xl focus:bg-orange-400">
                  <DashboardOutlinedIcon />
                  Dashboard
                </button>
              </li>
              <li className="flex gap-2">
                <button className="flex gap-2 w-full hover:bg-orange-400/40 p-2 rounded-xl focus:bg-orange-400">
                  <MicrowaveOutlinedIcon />
                  Restaurant Profile
                </button>
              </li>
              <li className="flex gap-2">
                <button className="flex gap-2 w-full hover:bg-orange-400/40 p-2 rounded-xl focus:bg-orange-400">
                  <MenuBookOutlinedIcon /> Menu Management
                </button>
              </li>
              <li className="flex gap-2">
                <button className="flex gap-2 w-full hover:bg-orange-400/40 p-2 rounded-xl focus:bg-orange-400">
                  <FoodBankOutlinedIcon /> Food Categories
                </button>
              </li>
              <li className="flex gap-2">
                <button className="flex gap-2 w-full hover:bg-orange-400/40 p-2 rounded-xl focus:bg-orange-400">
                  <AssignmentOutlinedIcon />
                  Pickup Orders
                </button>
              </li>
              <li className="flex gap-2">
                <button className="flex gap-2 w-full hover:bg-orange-400/40 p-2 rounded-xl focus:bg-orange-400">
                  <DateRangeOutlinedIcon /> Reservations
                </button>
              </li>
              <li className="flex gap-2">
                <button className="flex gap-2 w-full hover:bg-orange-400/40 p-2 rounded-xl focus:bg-orange-400">
                  <CommentOutlinedIcon />
                  Customer Reviews
                </button>
              </li>
              <li className="flex gap-2">
                <button className="flex gap-2 w-full hover:bg-orange-400/40 p-2 rounded-xl focus:bg-orange-400">
                  <SettingsOutlinedIcon />
                  Settings
                </button>
              </li>
            </ul>
          </div>
          {/* logout customer */}
          <div className="absolute bottom-0 pb-4">
            <ul className="flex flex-col gap-2">
              <li className="flex gap-2">
                <button className="flex gap-2 w-full p-2 rounded-xl focus:bg-orange-400 hover:text-red-600">
                  Customer Site
                </button>
              </li>
              <li className="flex gap-2">
                <button className="flex gap-2 w-full p-2 rounded-xl focus:bg-orange-400 hover:text-red-500">
                  <LogoutOutlinedIcon /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
