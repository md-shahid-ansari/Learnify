import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="mr-1 text-2xl font-bold">Learnify</div>
      <div className="flex items-center space-x-2">
        {/* Search Input with Icon */}
        <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-blue-200 max-w-xs">
          <i className="fas fa-search text-gray-500 text-xl ml-2"></i>
          <input
            type="text"
            placeholder="Search courses..."
            className="ml-2 bg-blue-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-none w-full"
          />
        </div>

        {/* Register/Login link styled as a button */}
        <Link
          to="/login-page"
          className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded"
        >
          <i className="fas fa-sign-in-alt text-xl mr-2" title="Register/Login"></i>
        </Link>
      </div>
    </header>
  );
}

export default Header;
