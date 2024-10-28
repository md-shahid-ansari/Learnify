// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">Learnify</div>
      <input
        type="text"
        placeholder="Search courses..."
        className="border border-gray-300 rounded-lg p-2 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs flex-grow"
      />
      <Link
        to="/login-page"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Register/Login
      </Link>
    </header>
  );
}

export default Header;
