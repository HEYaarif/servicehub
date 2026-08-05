import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "../../api/axios";

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const VendorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/vendor/profile")
      .then(({ data }) => setProfile(data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.patch("/vendor/profile", {
        businessName: profile.businessName,
        contact: profile.contact,
        address: profile.address,
      });
      setProfile(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Profile</h1>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[profile.status]}`}>
          {profile.status}
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Business name</label>
          <input
            value={profile.businessName || ""}
            onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Contact</label>
          <input
            value={profile.contact || ""}
            onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Address</label>
          <textarea
            rows={2}
            value={profile.address || ""}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default VendorProfile;