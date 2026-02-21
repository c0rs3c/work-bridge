"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/client-auth";
import { INDIA_STATES_AND_UTS } from "@/lib/india-states";

const empty = {
  agencyName: "",
  mobileNumber: "",
  landlineNumber: "",
  teamSize: "",
  skill: "",
  address: "",
  state: ""
};

export default function SupplierProfileForm() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch("/api/supplier/profile");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile.");
        if (data.profile) {
          setForm({
            agencyName: data.profile.agencyName || "",
            mobileNumber: data.profile.mobileNumber || "",
            landlineNumber: data.profile.landlineNumber || "",
            teamSize: String(data.profile.teamSize || ""),
            skill: data.profile.skill || "",
            address: data.profile.address || "",
            state: data.profile.state || ""
          });
        }
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await authFetch("/api/supplier/profile", { method: "PATCH", body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0] || data.error || "Failed to save.");
      setSuccess("Profile saved.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card grid gap-3 md:grid-cols-2" onSubmit={save}>
      <input className="input" placeholder="Name of the agency" value={form.agencyName} onChange={(e) => setForm((p) => ({ ...p, agencyName: e.target.value }))} required />
      <input className="input" placeholder="Mobile number" value={form.mobileNumber} onChange={(e) => setForm((p) => ({ ...p, mobileNumber: e.target.value }))} required />
      <input className="input" placeholder="Landline number" value={form.landlineNumber} onChange={(e) => setForm((p) => ({ ...p, landlineNumber: e.target.value }))} required />
      <input className="input" placeholder="Team size" value={form.teamSize} onChange={(e) => setForm((p) => ({ ...p, teamSize: e.target.value }))} required />
      <input className="input" placeholder="Skill" value={form.skill} onChange={(e) => setForm((p) => ({ ...p, skill: e.target.value }))} required />
      <select className="input" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} required>
        <option value="">Select State</option>
        {INDIA_STATES_AND_UTS.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      <textarea className="input md:col-span-2" placeholder="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} required />
      {error ? <p className="md:col-span-2 text-sm text-danger">{error}</p> : null}
      {success ? <p className="md:col-span-2 text-sm text-success">{success}</p> : null}
      <button className="btn-primary md:col-span-2" type="submit">Save Supplier Profile</button>
    </form>
  );
}
