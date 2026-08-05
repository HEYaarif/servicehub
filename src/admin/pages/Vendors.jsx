import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import api from "../../api/axios";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACTIVE", label: "Active" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/vendors");
      setVendors(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const visibleVendors = vendors.filter((v) => {
    const matchesStatus = !status || v.status === status;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      v.name?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  async function handleApprove(vendor) {
    setActioningId(vendor._id);
    try {
      const res = await api.patch(`/admin/vendors/${vendor._id}/approve`);
      setVendors((prev) =>
        prev.map((v) => (v._id === vendor._id ? res.data.vendor : v)),
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(vendor) {
    setActioningId(vendor._id);
    try {
      const res = await api.patch(`/admin/vendors/${vendor._id}/reject`);
      setVendors((prev) =>
        prev.map((v) => (v._id === vendor._id ? res.data.vendor : v)),
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Vendors
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review applications and manage vendor accounts.
            </p>
          </div>
          {!loading && (
            <p className="text-sm text-slate-400">
              {visibleVendors.length} shown
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  status === tab.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-64 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={fetchVendors}
              className="font-medium underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table card */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-500">Vendor</th>
                <th className="px-6 py-3 font-medium text-slate-500">Email</th>
                <th className="px-6 py-3 font-medium text-slate-500">Phone</th>
                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                <th className="px-6 py-3 text-right font-medium text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-5" colSpan={5}>
                      <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))}

              {!loading && visibleVendors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Inbox className="h-8 w-8" />
                      <p className="text-sm">No vendors match this view.</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                visibleVendors.map((vendor) => (
                  <tr key={vendor._id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {vendor.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{vendor.email}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {vendor.phone || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          STATUS_STYLES[vendor.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {vendor.status
                          ? vendor.status.charAt(0) +
                            vendor.status.slice(1).toLowerCase()
                          : "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApprove(vendor)}
                            disabled={actioningId === vendor._id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
                          >
                            {actioningId === vendor._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(vendor)}
                            disabled={actioningId === vendor._id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                          >
                            {actioningId === vendor._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5" />
                            )}
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-right text-xs text-slate-300">
                          —
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
