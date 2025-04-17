// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { to: "/", label: "" },
    { to: "/artikel", label: "" },
    { to: "/kontak", label: "" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10); // ubah jadi true kalau scrollY lebih dari 10px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 ease-in-out shadow-md ${
        scrolled ? "py-2 shadow-lg" : "py-2"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img
            src="/assets/image/logo.png"
            alt="MotorClub Logo"
            className={`object-contain transition-all duration-300 ${
              scrolled ? "w-10 h-10" : "w-[10vh] h-[10vh]"
            }`}
          />
          <div className="text-2xl font-bold text-black tracking-tight">
            Asphalt Destroyer
          </div>
        </div>

        {/* Links (desktop) */}
        <div className="hidden md:flex space-x-8 text-black text-base font-medium">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `pb-1 transition-all ${
                  isActive
                    ? "border-b-2 border-gray-600 text-gray-700"
                    : "hover:border-b-2 hover:border-gray-400"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => navigate("/")}
          className="ml-4 px-5 py-2 rounded-lg border border-gray-300 bg-green-500 text-white hover:bg-green-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu (Optional placeholder) */}
      <div className="md:hidden px-6 pb-4">
        <div className="flex flex-col space-y-2">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className="block py-2 px-4 text-black hover:text-white hover:bg-green-600 rounded transition"
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
