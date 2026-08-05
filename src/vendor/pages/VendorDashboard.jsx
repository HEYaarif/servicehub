import React, { useEffect, useState } from "react";
import { Store, ClipboardList, IndianRupee, Loader2 } from "lucide-react";
import api from "../../api/axios";

const StatCard = ({ icon: Icon, label, value, loading }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-xl font-semibold text-slate-900">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : value}
        </p>
      </div>
    </div>
  </div>
);

const VendorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/vendor/dashboard-stats")
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Welcome back{user?.name ? `, ${user.name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-slate-500">Here's how your services are doing.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Store} label="Active services" value={stats?.activeServices ?? "—"} loading={loading} />
        <StatCard icon={ClipboardList} label="Pending bookings" value={stats?.pendingBookings ?? "—"} loading={loading} />
        <StatCard icon={IndianRupee} label="Bookings today" value={stats?.bookingsToday ?? "—"} loading={loading} />
      </div>
    </div>
  );
};

export default VendorDashboard;