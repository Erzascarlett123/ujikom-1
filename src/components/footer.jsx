import React from "react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-black text-gray-200 border-t border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-center sm:text-left">
          © {new Date().getFullYear()} <span className="font-bold text-white">Asphalt Destroyer</span>. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="https://www.instagram.com/rezasatriaseptian._/" className="text-gray-400 hover:text-white transition">Instagram</a>
          <a href="https://www.facebook.com/groups/55257254500/" className="text-gray-400 hover:text-white transition">Facebook</a>
          <a href="https://www.youtube.com/@smkinfokomkotabogor" className="text-gray-400 hover:text-white transition">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
