import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const redirectByRole = (role) => {
    switch (role) {
      case "ADMIN":
        navigate("/admin/vendors");
        break;
      case "VENDOR":
        navigate("/vendor");
        break;
      case "CUSTOMER":
        navigate("/services");
        break;
      default:
        navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/login", form);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMsg(data.message);

      redirectByRole(data.user.role);
    } catch (error) {
      setMsg(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
      <div className="hidden lg:flex bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-700 text-white items-center justify-center p-16">
        <div>
          <h1 className="text-5xl font-bold leading-tight">Welcome Back</h1>

          <p className="mt-6 text-lg text-slate-300 leading-8">
            Login to access your dashboard, manage bookings, explore services
            and connect with trusted vendors.
          </p>

          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900"
            alt="Login"
            className="mt-10 rounded-2xl shadow-2xl"
          />
        </div>
      </div>
      <div className="flex justify-center items-center px-6 py-10">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-800">Sign In</h2>

            <p className="text-slate-500 mt-2">
              Access your ServiceHub account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Email
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
                <FaEnvelope className="text-slate-400 mr-3" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Password
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
                <FaLock className="text-slate-400 mr-3" />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button" className="text-indigo-600 hover:underline">
                Forgot Password?
              </button>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition">
              Login
            </button>

            {msg && (
              <p className="text-center text-red-600 font-medium">{msg}</p>
            )}

            <p className="text-center text-slate-600">
              Don't have an account?
              <span
                onClick={() => navigate("/signup")}
                className="ml-2 text-indigo-600 cursor-pointer hover:underline font-semibold"
              >
                Create Account
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
