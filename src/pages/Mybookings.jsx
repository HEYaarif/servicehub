import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertTriangle, Inbox, X } from "lucide-react";
import api from "../api/axios"

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CONFIRMED: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REJECTED: "bg-slate-100 text-slate-500",
  CANCELLED: "bg-slate-100 text-slate-500",
  NO_SHOW: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/customer/bookings");
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (booking) => {
    setCancelingId(booking._id);
    try {
      await api.patch(`/customer/bookings/${booking._id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, status: "CANCELLED" } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My bookings</h1>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={fetchBookings} className="font-medium underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-24 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {!loading && bookings.length === 0 && !error && (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white py-24 text-slate-400">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">No bookings yet.</p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {!loading &&
            bookings.map((b) => (
              <div key={b._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="font-medium text-slate-900">{b.serviceTitle}</p>
                  <p className="text-xs text-slate-500">
                    {b.vendorName} ·{" "}
                    {b.slotStartAt
                      ? new Date(b.slotStartAt).toLocaleString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">₹{(b.priceAtBooking / 100).toFixed(0)} · {b.paymentMode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[b.status]}`}>
                    {b.status}
                  </span>
                  {["PENDING", "CONFIRMED"].includes(b.status) && (
                    <button
                      onClick={() => handleCancel(b)}
                      disabled={cancelingId === b._id}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;