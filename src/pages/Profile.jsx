import React, { useState } from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Backend API will be added later
    alert("Profile Updated Successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
      >

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          My Profile
        </h1>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
        >
          Update Profile
        </button>

      </form>

    </div>
  );
};

export default Profile;