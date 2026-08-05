import React from "react";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Dashboard
        </h1>

        <div className="space-y-4">

          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold text-lg">{user?.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold text-lg">{user?.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-semibold text-lg">{user?.role}</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-semibold text-lg">{user?.status}</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;