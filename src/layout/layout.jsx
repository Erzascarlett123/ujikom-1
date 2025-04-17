import React, { useState } from "react";
import Sidebar from "../components/sidebar";

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`transition-all duration-300 ease-in-out w-full ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        <main className="pt-20 p-4">{children}</main>
      </div>
    </div>
  );
}
