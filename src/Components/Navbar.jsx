import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    {name:"services", path:"/services"},
    // {name:"All services", path:"/services/:id"},
    {name:"my-bookings", path:"/my-bookings"}
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-indigo-400"
          >
            ServiceHub
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className="hover:text-indigo-400 duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center">

            {!token ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg"
              >
                Login
              </button>
            ) : (
              <div className="relative">

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700"
                >
                  ⚙ Settings
                </button>

                {showSettings && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded-lg shadow-lg overflow-hidden">

                    <div className="px-4 py-3 border-b">
                      <h3 className="font-semibold">{user?.name}</h3>
                      <p className="text-sm text-gray-500">
                        {user?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"}
          </button>

        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-slate-800">

          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                navigate(link.path);
                setIsOpen(false);
              }}
              className="block w-full text-left px-5 py-3 hover:bg-slate-700"
            >
              {link.name}
            </button>
          ))}

          {!token ? (
            <button
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
              className="block w-full text-left px-5 py-3 bg-indigo-600 hover:bg-indigo-700"
            >
              Login
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsOpen(false);
                }}
                className="block w-full text-left px-5 py-3 hover:bg-slate-700"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  navigate("/profile");
                  setIsOpen(false);
                }}
                className="block w-full text-left px-5 py-3 hover:bg-slate-700"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-5 py-3 bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}

        </div>
      )}
    </nav>
  );
}