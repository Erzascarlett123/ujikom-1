import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-600">Honda</h1>
        <nav className="space-x-4">
          <a href="#" className="text-gray-700 hover:text-red-600">Beranda</a>
          <a href="#" className="text-gray-700 hover:text-red-600">Tentang</a>
          <a href="#" className="text-gray-700 hover:text-red-600">Produk</a>
          <a href="#" className="text-gray-700 hover:text-red-600">Kontak</a>
        </nav>
      </div>
    </header> 
  );
};

export default Header;
