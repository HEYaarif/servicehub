import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  CalendarClock,
  ClipboardList,
  UserCircle,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/vendor/services", label: "Services", icon: Store },
  { to: "/vendor/availability", label: "Availability", icon: CalendarClock },
  { to: "/vendor/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/vendor/profile", label: "Profile", icon: UserCircle },
];

const VendorLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };
  if (user?.status === "PENDING" || user?.status === "REJECTED") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {user.status === "PENDING" ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <CalendarClock className="h-6 w-6" />
              </div>
              <h1 className="text-lg font-semibold text-slate-900">Application under review</h1>
              <p className="mt-2 text-sm text-slate-500">
                Your vendor account is pending approval. You'll be able to manage services and
                bookings once an admin approves your application.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <Store className="h-6 w-6" />
              </div>
              <h1 className="text-lg font-semibold text-slate-900">Application rejected</h1>
              <p className="mt-2 text-sm text-slate-500">
                {user.rejectionReason || "Your vendor application was not approved."}
              </p>
            </>
          )}
          <button
            onClick={handleLogout}
            className="mt-6 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-lg font-semibold text-slate-900">Vendor panel</p>
          <p className="mt-0.5 truncate text-xs text-slate-400">{user?.email}</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;