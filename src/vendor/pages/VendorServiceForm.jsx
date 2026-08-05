import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Loader2 } from "lucide-react";
import api from "../../api/axios";

const emptyOffering = () => ({ name: "", durationMinutes: 30, priceMinorUnits: 0, active: true });

const VendorServiceForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    offerings: [emptyOffering()],
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    api
      .get(`/vendor/services/${id}`)
      .then(({ data }) =>
        setForm({
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          offerings: data.offerings?.length ? data.offerings : [emptyOffering()],
        })
      )
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const updateOffering = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      offerings: prev.offerings.map((o, i) => (i === index ? { ...o, [field]: value } : o)),
    }));
  };

  const addOffering = () =>
    setForm((prev) => ({ ...prev, offerings: [...prev.offerings, emptyOffering()] }));

  const removeOffering = (index) =>
    setForm((prev) => ({ ...prev, offerings: prev.offerings.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        offerings: form.offerings.map((o) => ({
          ...o,
          durationMinutes: Number(o.durationMinutes),
          priceMinorUnits: Math.round(Number(o.priceMinorUnits) * 100),
        })),
      };

      if (isEditing) {
        await api.patch(`/vendor/services/${id}`, payload);
      } else {
        await api.post("/vendor/services", payload);
      }
      navigate("/vendor/services");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {isEditing ? "Edit service" : "New service"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        New services start as a draft. Publish once you're ready for customers to book.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="e.g. Haircut & styling"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">Offerings</label>
            <button
              type="button"
              onClick={addOffering}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              <Plus className="h-3.5 w-3.5" />
              Add offering
            </button>
          </div>

          <div className="mt-2 space-y-3">
            {form.offerings.map((offering, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2 rounded-lg border border-slate-200 p-3">
                <input
                  required
                  placeholder="Name"
                  value={offering.name}
                  onChange={(e) => updateOffering(i, "name", e.target.value)}
                  className="col-span-5 rounded-md border border-slate-200 p-2 text-sm"
                />
                <input
                  required
                  type="number"
                  min="5"
                  placeholder="Minutes"
                  value={offering.durationMinutes}
                  onChange={(e) => updateOffering(i, "durationMinutes", e.target.value)}
                  className="col-span-3 rounded-md border border-slate-200 p-2 text-sm"
                />
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price (₹)"
                  value={offering.priceMinorUnits}
                  onChange={(e) => updateOffering(i, "priceMinorUnits", e.target.value)}
                  className="col-span-3 rounded-md border border-slate-200 p-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeOffering(i)}
                  disabled={form.offerings.length === 1}
                  className="col-span-1 flex justify-center text-slate-400 hover:text-rose-600 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate("/vendor/services")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : isEditing ? "Save changes" : "Create service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorServiceForm;