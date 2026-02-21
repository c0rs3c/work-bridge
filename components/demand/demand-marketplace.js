"use client";

import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/client-auth";

const emptyRequirement = {
  title: "",
  location: "",
  skills: "",
  quantity: "",
  startDate: "",
  notes: ""
};

export default function DemandMarketplace() {
  const [listings, setListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState("");
  const [form, setForm] = useState(emptyRequirement);

  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [state, setState] = useState("");
  const [minTeam, setMinTeam] = useState("");
  const [maxTeam, setMaxTeam] = useState("");

  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const selectedListing = useMemo(
    () => listings.find((l) => l.id === selectedListingId) || null,
    [listings, selectedListingId]
  );

  const loadListings = async () => {
    const res = await authFetch("/api/demand/requirements");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch requirements.");
    setListings(data.listings || []);

    if (!selectedListingId && data.listings?.[0]?.id) {
      setSelectedListingId(data.listings[0].id);
    }
  };

  const loadSuppliers = async () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (skill) params.set("skill", skill);
    if (state) params.set("state", state);
    if (minTeam) params.set("minTeam", minTeam);
    if (maxTeam) params.set("maxTeam", maxTeam);
    if (selectedListingId) params.set("listingId", selectedListingId);

    const res = await authFetch(`/api/demand/suppliers?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch suppliers.");
    setSuppliers(data.suppliers || []);
  };

  useEffect(() => {
    loadListings().catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    loadSuppliers().catch((e) => setError(e.message));
  }, [search, skill, state, minTeam, maxTeam, selectedListingId]);

  const postRequirement = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await authFetch("/api/demand/requirements", {
        method: "POST",
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post requirement.");

      setForm(emptyRequirement);
      setInfo("Labour requirement posted.");
      await loadListings();
      if (data.id) setSelectedListingId(data.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleShortlist = async (supplierUserId, shortlisted) => {
    setError("");
    setInfo("");

    try {
      if (!selectedListingId) throw new Error("Select or create a requirement first.");
      const res = await authFetch("/api/demand/shortlist", {
        method: "POST",
        body: JSON.stringify({ listingId: selectedListingId, supplierUserId, shortlisted: !shortlisted })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update shortlist.");
      setInfo(data.shortlisted ? "Supplier shortlisted." : "Supplier removed from shortlist.");
      await loadSuppliers();
    } catch (err) {
      setError(err.message);
    }
  };

  const closeRequirement = async () => {
    if (!selectedListingId) return;
    setError("");
    setInfo("");

    try {
      const res = await authFetch("/api/demand/requirements", {
        method: "PATCH",
        body: JSON.stringify({ listingId: selectedListingId, status: "closed" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to close requirement.");
      setInfo("Requirement closed.");
      await loadListings();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <form className="card grid gap-3 md:grid-cols-3" onSubmit={postRequirement}>
        <div className="md:col-span-3">
          <h2 className="text-lg font-semibold">Post Labour Requirement</h2>
        </div>
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
        <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required />
        <input className="input" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))} required />
        <input className="input" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} required />
        <input className="input" type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} required />
        <input className="input" placeholder="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
        <button className="btn-primary md:col-span-3" type="submit">Post Requirement</button>
      </form>

      <div className="card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">My Posted Requirements</h2>
          <button className="btn-secondary" type="button" disabled={!selectedListing || selectedListing.status === "closed"} onClick={closeRequirement}>
            Close Selected Requirement
          </button>
        </div>

        <select className="input" value={selectedListingId} onChange={(e) => setSelectedListingId(e.target.value)}>
          <option value="">Select requirement</option>
          {listings.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title} | {l.location} | {l.status}
            </option>
          ))}
        </select>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Search Suppliers</h2>
          <p className="text-sm text-muted">Selected requirement: {selectedListing ? selectedListing.title : "None"}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          <input className="input" placeholder="Search agency/email/skill" value={search} onChange={(e) => setSearch(e.target.value)} />
          <input className="input" placeholder="Skill exact" value={skill} onChange={(e) => setSkill(e.target.value)} />
          <input className="input" placeholder="State exact" value={state} onChange={(e) => setState(e.target.value)} />
          <input className="input" placeholder="Min team" value={minTeam} onChange={(e) => setMinTeam(e.target.value)} />
          <input className="input" placeholder="Max team" value={maxTeam} onChange={(e) => setMaxTeam(e.target.value)} />
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {info ? <p className="text-sm text-success">{info}</p> : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="py-2">Agency</th>
                <th className="py-2">Email</th>
                <th className="py-2">Skill</th>
                <th className="py-2">Team</th>
                <th className="py-2">State</th>
                <th className="py-2">Mobile</th>
                <th className="py-2">Status</th>
                <th className="py-2">Shortlist</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr className="border-b border-border" key={s.id}>
                  <td className="py-2">{s.agencyName || "-"}</td>
                  <td className="py-2">{s.email}</td>
                  <td className="py-2">{s.skill || "-"}</td>
                  <td className="py-2">{s.teamSize || "-"}</td>
                  <td className="py-2">{s.state || "-"}</td>
                  <td className="py-2">{s.mobileNumber || "-"}</td>
                  <td className="py-2">
                    <span className={s.status === "active" ? "status-badge status-active" : "status-badge status-inactive"}>{s.status}</span>
                  </td>
                  <td className="py-2">
                    <button className={s.shortlisted ? "btn-primary" : "btn-secondary"} type="button" onClick={() => toggleShortlist(s.id, s.shortlisted)} disabled={!selectedListingId}>
                      {s.shortlisted ? "Shortlisted" : "Add to Shortlist"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
