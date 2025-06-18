import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { FaUser, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);  
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-wide text-white hover:text-gray-300 transition-colors duration-300"
            onClick={closeMenu}
          >
            NoteNest
          </Link>

          
          <div className="sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white text-2xl focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

           
          <div className="hidden sm:flex items-center space-x-6">
            {user ? (
              <>
                <span className=" font-medium flex flex-col ">
                   <span className="font-semibold text-2xl">Hi, &nbsp; {user.name}</span>
                  <span className='text-lg text-purple-300 '>{user.email}</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-white text-purple-700 hover:bg-purple-100 px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  <span>Logout</span>
                  <FaSignInAlt />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-purple-700 hover:bg-purple-100 px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  <FaUser />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-purple-700 hover:bg-purple-100 px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4 space-y-4 text-center z-50">
          {user ? (
            <>
              <div className="text-lg">
                Hi, <span className="font-semibold">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full bg-white text-purple-700 hover:bg-purple-100 px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block bg-white text-purple-700 hover:bg-purple-100 px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="block bg-white text-purple-700 hover:bg-purple-100 px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
