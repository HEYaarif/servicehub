import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertTriangle, Inbox, Check, X, CheckCheck, UserX } from "lucide-react";
import api from "../../api/axios";

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CONFIRMED: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REJECTED: "bg-slate-100 text-slate-500",
  CANCELLED: "bg-slate-100 text-slate-500",
  NO_SHOW: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const STATUS_FILTERS = ["", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED", "NO_SHOW"];

const VendorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = status ? `?status=${status}` : "";
      const { data } = await api.get(`/vendor/bookings${params}`);
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const act = async (booking, action, extra = {}) => {
    setActioningId(booking._id);
    try {
      const { data } = await api.patch(`/vendor/bookings/${booking._id}/${action}`, extra);
      setBookings((prev) => prev.map((b) => (b._id === booking._id ? data.booking : b)));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Bookings</h1>
      <p className="mt-1 text-sm text-slate-500">Respond to requests and manage delivery.</p>

      <div className="mt-4 flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              status === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={fetchBookings} className="font-medium underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-medium text-slate-500">Customer</th>
              <th className="px-6 py-3 font-medium text-slate-500">Service</th>
              <th className="px-6 py-3 font-medium text-slate-500">Slot</th>
              <th className="px-6 py-3 font-medium text-slate-500">Status</th>
              <th className="px-6 py-3 text-right font-medium text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-6 py-5">
                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  </td>
                </tr>
              ))}

            {!loading && bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Inbox className="h-8 w-8" />
                    <p className="text-sm">No bookings in this view.</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              bookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{b.customerName}</td>
                  <td className="px-6 py-4 text-slate-600">{b.serviceTitle}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {b.slotStartAt ? new Date(b.slotStartAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {b.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => act(b, "confirm")}
                            disabled={actioningId === b._id}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Confirm
                          </button>
                          <button
                            onClick={() => act(b, "reject")}
                            disabled={actioningId === b._id}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </>
                      )}
                      {b.status === "CONFIRMED" && (
                        <>
                          <button
                            onClick={() => act(b, "complete")}
                            disabled={actioningId === b._id}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Complete
                          </button>
                          <button
                            onClick={() => act(b, "no-show")}
                            disabled={actioningId === b._id}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                          >
                            <UserX className="h-3.5 w-3.5" />
                            No-show
                          </button>
                        </>
                      )}
                      {!["PENDING", "CONFIRMED"].includes(b.status) && (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorBookings;