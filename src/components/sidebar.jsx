import React from "react";
import {
  Calendar,
  Image,
  Users,
  FileText,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-300 z-40 transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-10"></div>
        <div className="p-6 border-b border-gray-300">
          {isOpen && (
            <>
              <h2 className="text-2xl font-bold text-gray-800">MotorClub</h2>
              <p className="text-sm text-gray-500 mt-1">Dashboard Menu</p>
            </>
          )}
        </div>

        <nav className="flex flex-col p-4 space-y-4">
          <SidebarLink to="/event" icon={<Calendar className="w-5 h-5" />} label="Event" isOpen={isOpen} />
          <SidebarLink to="/gallery" icon={<Image className="w-5 h-5" />} label="Gallery" isOpen={isOpen} />
          <SidebarLink to="/clients" icon={<Users className="w-5 h-5" />} label="Klien Kami" isOpen={isOpen} />
          <SidebarLink to="/artikel" icon={<FileText className="w-5 h-5" />} label="Artikel" isOpen={isOpen} />
          <SidebarLink to="/store" icon={<ShoppingBag className="w-5 h-5" />} label="Store" isOpen={isOpen} />
        </nav>
      </aside>

      {/* Tombol toggle (di tengah sidebar) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 z-50 p-2 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
        style={{
          left: isOpen ? "16rem" : "4rem",
          transform: "translateY(-50%)",
        }}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </>
  );
}

function SidebarLink({ to, icon, label, isOpen }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 text-gray-700 hover:bg-green-100 p-2 rounded-lg transition-all"
    >
      {icon}
      {isOpen && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );
}
