import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, Clock, IndianRupee } from "lucide-react";
import api from "../api/axios"

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [selectedOfferingId, setSelectedOfferingId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMode, setPaymentMode] = useState("PAY_AFTER");
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/services/${id}`)
      .then(({ data }) => {
        setService(data);
        if (data.offerings?.length) setSelectedOfferingId(data.offerings[0]._id);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!selectedOfferingId) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    api
      .get(`/services/${id}/slots`, {
        params: { offeringId: selectedOfferingId, from: todayISO(), to: addDays(13) },
      })
      .then(({ data }) => setSlots(data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setSlotsLoading(false));
  }, [id, selectedOfferingId]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    setError(null);
    try {
      await api.post("/bookings", {
        serviceId: id,
        offeringId: selectedOfferingId,
        startAt: selectedSlot.startAt,
        paymentMode,
      });
      navigate("/my-bookings");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      // The picked slot may have just filled up — refresh the list so it disappears.
      if (err.response?.status === 409) {
        setSlots((prev) => prev.filter((s) => s.startAt !== selectedSlot.startAt));
        setSelectedSlot(null);
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-center text-slate-500">
        <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-rose-400" />
        {error || "Service not found."}
      </div>
    );
  }

  const selectedOffering = service.offerings.find((o) => o._id === selectedOfferingId);

  // Group slots by date for a cleaner picker
  const slotsByDate = slots.reduce((acc, slot) => {
    const dateKey = slot.startAt.slice(0, 10);
    (acc[dateKey] ||= []).push(slot);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl p-8">
      <p className="text-xs font-medium text-slate-400">{service.categoryId?.name}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{service.title}</h1>
      <p className="mt-1 text-sm text-slate-500">by {service.vendorId?.businessName}</p>
      <p className="mt-4 text-sm text-slate-600">{service.description}</p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Offerings */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900">Choose an offering</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {service.offerings.map((offering) => (
            <button
              key={offering._id}
              onClick={() => setSelectedOfferingId(offering._id)}
              className={`rounded-lg border p-4 text-left transition ${
                selectedOfferingId === offering._id
                  ? "border-slate-900 ring-1 ring-slate-900"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <p className="font-medium text-slate-900">{offering.name}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {offering.durationMinutes} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5" /> {(offering.priceMinorUnits / 100).toFixed(0)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Slot picker */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900">Pick a time</h2>

        {slotsLoading && (
          <div className="flex justify-center py-8 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {!slotsLoading && slots.length === 0 && (
          <p className="mt-3 text-sm text-slate-400">No available slots in the next two weeks.</p>
        )}

        {!slotsLoading && Object.keys(slotsByDate).length > 0 && (
          <div className="mt-3 space-y-4">
            {Object.entries(slotsByDate).map(([date, daySlots]) => (
              <div key={date}>
                <p className="mb-2 text-xs font-medium text-slate-500">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {daySlots.map((slot) => (
                    <button
                      key={slot.startAt}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                        selectedSlot?.startAt === slot.startAt
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {new Date(slot.startAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment mode + book */}
      {selectedSlot && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {selectedOffering?.name} · ₹{(selectedOffering?.priceMinorUnits / 100).toFixed(0)}
              </p>
              <p className="text-xs text-slate-500">
                {new Date(selectedSlot.startAt).toLocaleString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="PAY_AFTER">Pay after service</option>
              <option value="PAY_NOW">Pay now</option>
            </select>
          </div>
          <button
            onClick={handleBook}
            disabled={booking}
            className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {booking ? "Booking…" : "Confirm booking"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;