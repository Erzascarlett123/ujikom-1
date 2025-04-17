// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Image,
  Users,
  FileText,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { to: "/eventAdmin", icon: <Calendar className="w-5 h-5" />, label: "Event" },
  { to: "/galleryAdmin", icon: <Image className="w-5 h-5" />, label: "Gallery" },
  { to: "/client", icon: <Users className="w-5 h-5" />, label: "Klien Kami" },
  { to: "/admin", icon: <FileText className="w-5 h-5" />, label: "Artikel" },
  { to: "/produkAdmin", icon: <ShoppingBag className="w-5 h-5" />, label: "Store" },
];

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 min-h-screen bg-white shadow-lg fixed top-20 left-0 z-40 border-r border-black`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-extrabold text-green-600">
            <span className="bg-gradient-to-r from-gray-600 to-red-400 bg-clip-text text-transparent">
              AsphaltDestroyer
            </span>
          </h2>
        )}
        <button onClick={toggleSidebar} className="text-gray-600">
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <nav className="flex flex-col p-2 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? "bg-green-100 text-gray-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
              }`
            }
          >
            {icon}
            {!isCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
