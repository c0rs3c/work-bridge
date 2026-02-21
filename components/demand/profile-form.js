"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/client-auth";

export default function DemandProfileForm() {
  const [form, setForm] = useState({ organizationName: "", contactDetails: "", defaultLocation: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch("/api/demand/profile");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile.");
        if (data.profile) {
          setForm({
            organizationName: data.profile.organizationName || "",
            contactDetails: data.profile.contactDetails || "",
            defaultLocation: data.profile.defaultLocation || ""
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
      const res = await authFetch("/api/demand/profile", { method: "PATCH", body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSuccess("Profile saved.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card grid gap-3" onSubmit={save}>
      <input className="input" placeholder="Organization name" value={form.organizationName} onChange={(e) => setForm((p) => ({ ...p, organizationName: e.target.value }))} />
      <input className="input" placeholder="Contact details" value={form.contactDetails} onChange={(e) => setForm((p) => ({ ...p, contactDetails: e.target.value }))} />
      <input className="input" placeholder="Default location" value={form.defaultLocation} onChange={(e) => setForm((p) => ({ ...p, defaultLocation: e.target.value }))} />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {success ? <p className="text-sm text-success">{success}</p> : null}
      <button className="btn-primary" type="submit">Save Demand Profile</button>
    </form>
  );
}
