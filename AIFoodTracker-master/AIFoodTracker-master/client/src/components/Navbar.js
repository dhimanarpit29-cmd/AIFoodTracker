import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiHome, FiUpload, FiBarChart, FiUser, FiLogOut, FiActivity } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/upload', label: 'Upload Meal', icon: FiUpload },
    { path: '/history', label: 'Meal History', icon: FiBarChart },
    { path: '/analytics', label: 'Analytics', icon: FiBarChart },
    { path: '/profile', label: 'Profile', icon: FiUser },
  ];

  const publicNavItems = [
    { path: '/about', label: 'About', icon: FiActivity },
  ];

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center group-hover:animate-float transition-all duration-300">
                    <FiActivity className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-primary-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                </div>
                <h1 className="text-2xl font-heading font-bold text-secondary-800 group-hover:text-primary-600 transition-colors duration-200">
                  CalWise
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-secondary-600 hover:text-primary-600 px-4 py-2 rounded-2xl text-sm font-heading font-medium transition-all duration-200 hover:bg-secondary-50 glow-on-hover"
              >
                {item.label}
              </Link>
            ))}
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-secondary-600 hover:text-primary-600 px-4 py-2 rounded-2xl text-sm font-heading font-medium transition-all duration-200 hover:bg-secondary-50 glow-on-hover"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-secondary-200">
              <span className="text-sm font-body text-secondary-600">
                Welcome, {user?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="btn-danger flex items-center space-x-2"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-secondary-600 hover:text-primary-600 focus:outline-none p-2 rounded-2xl hover:bg-secondary-50 transition-colors duration-200"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white/95 backdrop-blur-sm">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 block px-4 py-3 rounded-2xl text-base font-heading font-medium transition-all duration-200 flex items-center space-x-3"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 block px-4 py-3 rounded-2xl text-base font-heading font-medium transition-all duration-200 flex items-center space-x-3"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-secondary-200">
              <div className="px-4 py-3">
                <p className="text-sm font-body text-secondary-600 mb-3">
                  Welcome, {user?.name || 'User'}
                </p>
                <button
                  onClick={handleLogout}
                  className="btn-danger w-full flex items-center justify-center space-x-2"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
