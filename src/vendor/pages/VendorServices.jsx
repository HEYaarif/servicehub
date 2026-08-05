import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2, AlertTriangle, Inbox, Pencil, CalendarClock, Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";

const STATUS_STYLES = {
  DRAFT: "bg-slate-100 text-slate-600",
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  SUSPENDED: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const VendorServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/vendor/services");
      setServices(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const togglePublish = async (service) => {
    if (service.status === "SUSPENDED") return;
    const nextStatus = service.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setTogglingId(service._id);
    try {
      const { data } = await api.patch(`/vendor/services/${service._id}`, { status: nextStatus });
      setServices((prev) => prev.map((s) => (s._id === service._id ? data : s)));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Services</h1>
          <p className="mt-1 text-sm text-slate-500">Manage what you offer and its pricing.</p>
        </div>
        <Link
          to="/vendor/services/new"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          New service
        </Link>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={fetchServices} className="font-medium underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!loading && services.length === 0 && !error && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-slate-400">
          <Inbox className="h-8 w-8" />
          <p className="text-sm">No services yet — create your first one.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service._id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-slate-900">{service.title}</h3>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[service.status]}`}>
                {service.status}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{service.description}</p>
            <p className="mt-2 text-xs text-slate-400">
              {service.offerings?.length || 0} offering{service.offerings?.length === 1 ? "" : "s"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.status !== "SUSPENDED" && (
                <button
                  onClick={() => togglePublish(service)}
                  disabled={togglingId === service._id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  {service.status === "PUBLISHED" ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Publish
                    </>
                  )}
                </button>
              )}
              <Link
                to={`/vendor/services/${service._id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
              <Link
                to={`/vendor/availability?serviceId=${service._id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Availability
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorServices;