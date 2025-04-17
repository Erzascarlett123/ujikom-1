// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/sidebarAdmin";
import Navbar from "../components/navbarAdmin"

export default function MainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <main className="pt-20 p-4">{children}</main>
      </div>
      <Navbar/>
    </div>
  );
}
