import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Check if current path is auth pages
  const isAuthPage = location.pathname.includes("/auth/");

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Move the conditional rendering to the return statement
  if (isAuthPage) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled || isOpen ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary-500 text-2xl font-poppins font-bold">
              FoodShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium hover:text-primary-500 transition-colors ${
                location.pathname === "/" ? "text-primary-500" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={`font-medium hover:text-primary-500 transition-colors ${
                location.pathname === "/how-it-works"
                  ? "text-primary-500"
                  : "text-gray-700"
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/contact"
              className={`font-medium hover:text-primary-500 transition-colors ${
                location.pathname === "/contact"
                  ? "text-primary-500"
                  : "text-gray-700"
              }`}
            >
              Contact Us
            </Link>
            {user && (
              <>
                <Link
                  to="/map"
                  className={`font-medium hover:text-primary-500 transition-colors ${
                    location.pathname === "/map"
                      ? "text-primary-500"
                      : "text-gray-700"
                  }`}
                >
                  Food Map
                </Link>
                <Link
                  to="/donate"
                  className={`font-medium hover:text-primary-500 transition-colors ${
                    location.pathname === "/donate"
                      ? "text-primary-500"
                      : "text-gray-700"
                  }`}
                >
                  Donate
                </Link>
                <Link
                  to="/rewards"
                  className={`font-medium hover:text-primary-500 transition-colors ${
                    location.pathname === "/rewards"
                      ? "text-primary-500"
                      : "text-gray-700"
                  }`}
                >
                  Rewards
                </Link>
                <a
                  href="https://maverick4.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-medium hover:text-primary-500 transition-colors ${
                    location.pathname.includes("/dashboard")
                      ? "text-primary-500"
                      : "text-gray-700"
                  }`}
                >
                  Predict
                </a>
                <a
                  href="https://eatby-date.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-primary-500 transition-colors text-gray-700"
                >
                  Inventory
                </a>
                <a
                  href="https://cuisine-compass.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-primary-500 transition-colors text-gray-700"
                >
                  Cuisine
                </a>
              </>
            )}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-500"
                >
                  <User size={20} />
                  <span>Dashboard</span>
                </Link>
                <button onClick={() => signOut()} className="btn-outline py-2">
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/auth/login" className="btn-outline py-2">
                  Log In
                </Link>
                <Link to="/auth/signup" className="btn-primary py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X size={24} className="text-gray-800" />
            ) : (
              <Menu size={24} className="text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <div className="container-custom py-6 px-4 space-y-6">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className={`font-medium text-lg ${
                    location.pathname === "/"
                      ? "text-primary-500"
                      : "text-gray-700"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/how-it-works"
                  className={`font-medium text-lg ${
                    location.pathname === "/how-it-works"
                      ? "text-primary-500"
                      : "text-gray-700"
                  }`}
                >
                  How It Works
                </Link>
                <Link
                  to="/contact"
                  className={`font-medium text-lg ${
                    location.pathname === "/contact"
                      ? "text-primary-500"
                      : "text-gray-700"
                  }`}
                >
                  Contact Us
                </Link>
                {user && (
                  <>
                    <Link
                      to="/map"
                      className={`font-medium text-lg ${
                        location.pathname === "/map"
                          ? "text-primary-500"
                          : "text-gray-700"
                      }`}
                    >
                      Food Map
                    </Link>
                    <Link
                      to="/donate"
                      className={`font-medium text-lg ${
                        location.pathname === "/donate"
                          ? "text-primary-500"
                          : "text-gray-700"
                      }`}
                    >
                      Donate
                    </Link>
                    <Link
                      to="/rewards"
                      className={`font-medium text-lg ${
                        location.pathname === "/rewards"
                          ? "text-primary-500"
                          : "text-gray-700"
                      }`}
                    >
                      Rewards
                    </Link>
                    <a
                      href="https://maverick4.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-medium text-lg ${
                        location.pathname.includes("/dashboard")
                          ? "text-primary-500"
                          : "text-gray-700"
                      }`}
                    >
                      Predict
                    </a>
                    <a
                      href="https://eatby-date.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-lg text-gray-700"
                    >
                      Inventory
                    </a>
                    <a
                      href="https://cuisine-compass.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-lg text-gray-700"
                    >
                      Cuisine
                    </a>
                  </>
                )}
              </nav>

              <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Link to="/dashboard" className="btn-primary w-full">
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="btn-outline w-full"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" className="btn-outline w-full">
                      Log In
                    </Link>
                    <Link to="/auth/signup" className="btn-primary w-full">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
