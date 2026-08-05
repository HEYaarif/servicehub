import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Loader2, Inbox, AlertTriangle } from "lucide-react";
import api from "../api/axios"

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (category) params.set("category", category);
      if (search) params.set("search", search);

      const { data } = await api.get(`/services?${params.toString()}`);
      setServices(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    const handle = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(handle);
  }, [search, category]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Browse services</h1>
          <p className="mt-1 text-sm text-slate-500">Find something to book near you.</p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services"
              className="w-64 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
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
          <div className="flex justify-center py-24 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {!loading && services.length === 0 && !error && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white py-24 text-slate-400">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">No services match your search.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            services.map((service) => {
              const cheapest = service.offerings?.length
                ? Math.min(...service.offerings.map((o) => o.priceMinorUnits))
                : null;
              return (
                <Link
                  key={service._id}
                  to={`/services/${service._id}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md"
                >
                  <div className="flex h-36 items-center justify-center bg-slate-100 text-slate-300">
                    {service.images?.[0] ? (
                      <img src={service.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs">No image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium text-slate-400">{service.categoryId?.name}</p>
                    <h3 className="mt-0.5 font-medium text-slate-900 group-hover:text-slate-700">
                      {service.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{service.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{service.vendorId?.businessName}</span>
                      {cheapest !== null && (
                        <span className="text-sm font-semibold text-slate-900">
                          from ₹{(cheapest / 100).toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>

        {!loading && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;