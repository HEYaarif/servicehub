import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Trash2, Loader2, AlertTriangle } from "lucide-react";
import api from "../../api/axios";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const minutesToTime = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const VendorAvailability = () => {
  const [searchParams] = useSearchParams();
  const [serviceId, setServiceId] = useState(searchParams.get("serviceId") || "");
  const [services, setServices] = useState([]);
  const [rules, setRules] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/vendor/services").then(({ data }) => setServices(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!serviceId) return;
    setLoading(true);
    api
      .get(`/vendor/services/${serviceId}/availability`)
      .then(({ data }) => {
        setRules(data.availabilityRules || []);
        setExceptions(data.dateExceptions || []);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [serviceId]);

  const addRule = () =>
    setRules((prev) => [...prev, { weekday: 1, startMin: 540, endMin: 780, capacity: 1 }]);
  const updateRule = (i, field, value) =>
    setRules((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  const removeRule = (i) => setRules((prev) => prev.filter((_, idx) => idx !== i));

  const addException = () =>
    setExceptions((prev) => [
      ...prev,
      { date: new Date().toISOString().slice(0, 10), isClosed: true, startMin: null, endMin: null },
    ]);
  const updateException = (i, field, value) =>
    setExceptions((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  const removeException = (i) => setExceptions((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!serviceId) {
      setError("Select a service before saving.");
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      // Expected: PUT replaces the full rule/exception set for this service.
      // The backend derives bookable slots from these — nothing here is a slot itself.
      await api.put(`/vendor/services/${serviceId}/availability`, {
        availabilityRules: rules,
        dateExceptions: exceptions,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save availability:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Availability</h1>
      <p className="mt-1 text-sm text-slate-500">
        Set weekly hours and one-off exceptions. Bookable slots are generated from these — you never enter a slot directly.
      </p>

      <div className="mt-5">
        <label className="block text-sm font-medium text-slate-700">Service</label>
        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="mt-1 w-full max-w-sm rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!loading && serviceId && (
        <>
          {/* Weekly rules */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Weekly hours</h2>
              <button
                onClick={addRule}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <Plus className="h-3.5 w-3.5" />
                Add window
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {rules.map((rule, i) => (
                <div key={i} className="grid grid-cols-12 items-center gap-2 rounded-lg border border-slate-200 p-3">
                  <select
                    value={rule.weekday}
                    onChange={(e) => updateRule(i, "weekday", Number(e.target.value))}
                    className="col-span-3 rounded-md border border-slate-200 p-2 text-sm"
                  >
                    {WEEKDAYS.map((d, idx) => (
                      <option key={d} value={idx}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={minutesToTime(rule.startMin)}
                    onChange={(e) => updateRule(i, "startMin", timeToMinutes(e.target.value))}
                    className="col-span-3 rounded-md border border-slate-200 p-2 text-sm"
                  />
                  <input
                    type="time"
                    value={minutesToTime(rule.endMin)}
                    onChange={(e) => updateRule(i, "endMin", timeToMinutes(e.target.value))}
                    className="col-span-3 rounded-md border border-slate-200 p-2 text-sm"
                  />
                  <input
                    type="number"
                    min="1"
                    value={rule.capacity}
                    onChange={(e) => updateRule(i, "capacity", Number(e.target.value))}
                    title="Capacity per slot"
                    className="col-span-2 rounded-md border border-slate-200 p-2 text-sm"
                  />
                  <button
                    onClick={() => removeRule(i)}
                    className="col-span-1 flex justify-center text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {rules.length === 0 && (
                <p className="text-sm text-slate-400">No weekly hours set — this service has no bookable slots yet.</p>
              )}
            </div>
          </section>

          {/* Date exceptions */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Date exceptions</h2>
              <button
                onClick={addException}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <Plus className="h-3.5 w-3.5" />
                Add exception
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {exceptions.map((exception, i) => (
                <div key={i} className="grid grid-cols-12 items-center gap-2 rounded-lg border border-slate-200 p-3">
                  <input
                    type="date"
                    value={exception.date?.slice(0, 10)}
                    onChange={(e) => updateException(i, "date", e.target.value)}
                    className="col-span-4 rounded-md border border-slate-200 p-2 text-sm"
                  />
                  <label className="col-span-3 flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={exception.isClosed}
                      onChange={(e) => updateException(i, "isClosed", e.target.checked)}
                    />
                    Closed
                  </label>
                  {!exception.isClosed && (
                    <>
                      <input
                        type="time"
                        value={exception.startMin != null ? minutesToTime(exception.startMin) : ""}
                        onChange={(e) => updateException(i, "startMin", timeToMinutes(e.target.value))}
                        className="col-span-2 rounded-md border border-slate-200 p-2 text-sm"
                      />
                      <input
                        type="time"
                        value={exception.endMin != null ? minutesToTime(exception.endMin) : ""}
                        onChange={(e) => updateException(i, "endMin", timeToMinutes(e.target.value))}
                        className="col-span-2 rounded-md border border-slate-200 p-2 text-sm"
                      />
                    </>
                  )}
                  <button
                    onClick={() => removeException(i)}
                    className="col-span-1 flex justify-center text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {exceptions.length === 0 && (
                <p className="text-sm text-slate-400">No exceptions — normal weekly hours apply every week.</p>
              )}
            </div>
          </section>

          <div className="mt-8 flex items-center justify-end gap-3">
            {saved && <span className="text-sm font-medium text-emerald-600">Saved</span>}
            <button
              onClick={handleSave}
              disabled={saving || !serviceId}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save availability"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorAvailability;