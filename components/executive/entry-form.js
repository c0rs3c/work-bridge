"use client";

import { useState } from "react";
import { authFetch } from "@/lib/client-auth";

export default function ExecutiveEntryForm() {
  const [form, setForm] = useState({
    agencyName: "",
    skill: "",
    teamSize: "",
    wageRateInRupee: "",
    rating: "5",
    remarks: "",
    entryType: "other"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await authFetch("/api/entries", {
        method: "POST",
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0] || data.error || "Failed to submit.");
      setSuccess("Entry submitted.");
      setForm({ agencyName: "", skill: "", teamSize: "", wageRateInRupee: "", rating: "5", remarks: "", entryType: "other" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
      <input className="input" placeholder="Name of the agency" value={form.agencyName} onChange={(e) => setForm((p) => ({ ...p, agencyName: e.target.value }))} required />
      <input className="input" placeholder="Skill" value={form.skill} onChange={(e) => setForm((p) => ({ ...p, skill: e.target.value }))} required />
      <input className="input" placeholder="Team size" value={form.teamSize} onChange={(e) => setForm((p) => ({ ...p, teamSize: e.target.value }))} required />
      <input className="input" placeholder="Wage rate (in rupee)" value={form.wageRateInRupee} onChange={(e) => setForm((p) => ({ ...p, wageRateInRupee: e.target.value }))} required />
      <select className="input" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}>
        <option value="5">★★★★★ (5)</option>
        <option value="4">★★★★ (4)</option>
        <option value="3">★★★ (3)</option>
        <option value="2">★★ (2)</option>
        <option value="1">★ (1)</option>
      </select>
      <textarea className="input md:col-span-2" placeholder="Remarks" value={form.remarks} onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))} required />
      {error ? <p className="md:col-span-2 text-sm text-danger">{error}</p> : null}
      {success ? <p className="md:col-span-2 text-sm text-success">{success}</p> : null}
      <button className="btn-primary md:col-span-2" type="submit">Submit Entry</button>
    </form>
  );
}
