// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    // Bersihkan event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full border border-black z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white backdrop-blur-md py-2 shadow-md border-b border-gray-200"
          : "bg-white py-2"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center transition-all duration-300 px-4">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/image/logo.png"
            alt="MotorClub Logo"
            className={`object-contain transition-all duration-300 ${
              isScrolled ? "w-[7vh] h-[7vh]" : "w-[10vh] h-[10vh]"
            }`}
          />
          <div
            className={`font-bold tracking-wide transition-all duration-300 ${
              isScrolled ? "text-md" : "text-xl"
            }`}
          >
            Asphalt Destroyer
          </div>
        </div>
        <ul className="flex space-x-6 font-semibold text-gray-800">
  {["Home", "Kontak", "Login"].map((item, idx) => {
    const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
    return (
      <li key={idx} className="relative group">
        <a
          href={href}
          className="text-gray-800 transition-colors duration-300 group-hover:text-gray-500"
        >
          {item}
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
        </a>
      </li>
    );
  })}
</ul>

      </div>
    </nav>
  );
}
