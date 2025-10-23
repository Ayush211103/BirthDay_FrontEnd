import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = ["Home", "Surprise", "Wishes", "Gift", "Party", "Frolic"];

  return (
    <nav className="bg-pink-500 text-white fixed w-full top-0 left-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo or Title */}
        <h1 className="text-2xl font-bold tracking-wide cursor-pointer">
          🎉
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-lg font-medium">
          {menuItems.map((item) => (
            <li key={item} className="hover:text-yellow-200 cursor-pointer transition">
              {item}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-pink-600 flex flex-col space-y-4 py-4 text-center text-lg font-medium">
          {menuItems.map((item) => (
            <li
              key={item}
              className="hover:text-yellow-200 cursor-pointer transition"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;