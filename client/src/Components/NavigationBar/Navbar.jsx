import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav className="bg-orange-600 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo or Brand Name */}
          <NavLink href="/" className="text-pink-200 text-2xl font-serif">
            Ink Attire{" "}
          </NavLink>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4">
            <li>
              <NavLink to="/home" className="text-white">
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/" className="text-white">
                Logout
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Mobile Menu (Hidden by Default) */}
        <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="#" className="text-white">
                Home
              </a>
            </li>

            <li>
              <a href="#" className="text-white">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
