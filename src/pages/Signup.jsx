import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import api from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/signup", form);

      setMsg(data.message);

      navigate("/login");
    } catch (error) {
      setMsg(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
      <div className="hidden lg:flex bg-gradient-to-br from-indigo-700 via-slate-800 to-slate-900 text-white items-center justify-center p-16">
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Join ServiceHub
          </h1>
          <p className="mt-6 text-lg text-slate-300 leading-8">
            Become a part of our growing community. Whether you're looking for
            trusted home services or want to offer your professional skills,
            ServiceHub has you covered.
          </p>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
            alt="Signup"
            className="mt-10 rounded-2xl shadow-2xl"
          />
        </div>
      </div>
      <div className="flex justify-center items-center px-6 py-10">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-800">
              Create Account
            </h2>

            <p className="text-slate-500 mt-2">
              Register to continue with ServiceHub
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Full Name
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
                <FaUser className="text-slate-400 mr-3" />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>
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
                  placeholder="Create password"
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Register As
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
                <FaUserTag className="text-slate-400 mr-3" />

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="VENDOR">Vendor</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition">
              Create Account
            </button>

            {msg && (
              <p className="text-center text-red-600 font-medium">{msg}</p>
            )}

            <p className="text-center text-slate-600">
              Already have an account?
              <span
                onClick={() => navigate("/login")}
                className="ml-2 text-indigo-600 cursor-pointer hover:underline font-semibold"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
