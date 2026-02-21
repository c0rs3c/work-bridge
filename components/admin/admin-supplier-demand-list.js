"use client";

import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/client-auth";

export default function AdminSupplierDemandList() {
  const [suppliers, setSuppliers] = useState([]);
  const [demands, setDemands] = useState([]);
  const [view, setView] = useState("suppliers");
  const [selected, setSelected] = useState(null);
  const [activeOnly, setActiveOnly] = useState(false);
  const [mockOnly, setMockOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch("/api/admin/profiles");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load supplier and demand data.");
        setSuppliers(data.suppliers || []);
        setDemands(data.demands || []);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  const supplierStates = useMemo(
    () => Array.from(new Set(suppliers.map((s) => s.state).filter(Boolean))).sort(),
    [suppliers]
  );
  const supplierSkills = useMemo(
    () => Array.from(new Set(suppliers.map((s) => s.skill).filter(Boolean))).sort(),
    [suppliers]
  );

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (activeOnly && s.status !== "active") return false;
      if (mockOnly && !s.isMockData) return false;
      if (stateFilter !== "all" && s.state !== stateFilter) return false;
      if (skillFilter !== "all" && s.skill !== skillFilter) return false;
      if (!query.trim()) return true;

      const q = query.toLowerCase();
      return (
        String(s.agencyName || "").toLowerCase().includes(q) ||
        String(s.email || "").toLowerCase().includes(q) ||
        String(s.mobileNumber || "").toLowerCase().includes(q) ||
        String(s.skill || "").toLowerCase().includes(q) ||
        String(s.state || "").toLowerCase().includes(q)
      );
    });
  }, [suppliers, activeOnly, mockOnly, stateFilter, skillFilter, query]);

  const filteredDemands = useMemo(() => {
    return demands.filter((d) => {
      if (activeOnly && d.status !== "active") return false;
      if (mockOnly && !d.isMockData) return false;
      if (!query.trim()) return true;

      const q = query.toLowerCase();
      return (
        String(d.organizationName || "").toLowerCase().includes(q) ||
        String(d.email || "").toLowerCase().includes(q) ||
        String(d.contactDetails || "").toLowerCase().includes(q) ||
        String(d.defaultLocation || "").toLowerCase().includes(q)
      );
    });
  }, [demands, activeOnly, mockOnly, query]);

  const rows = useMemo(
    () => (view === "suppliers" ? filteredSuppliers : filteredDemands),
    [view, filteredSuppliers, filteredDemands]
  );

  return (
    <div className="space-y-5">
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <button className={`card text-left ${view === "suppliers" ? "card-active" : ""}`} type="button" onClick={() => setView("suppliers")}>
          <p className="text-sm text-muted">Supplier Accounts</p>
          <p className="mt-1 text-3xl font-semibold">{suppliers.length}</p>
          <p className="mt-2 text-xs text-muted">Click to view supplier list</p>
        </button>
        <button className={`card text-left ${view === "demands" ? "card-active" : ""}`} type="button" onClick={() => setView("demands")}>
          <p className="text-sm text-muted">Demand Accounts</p>
          <p className="mt-1 text-3xl font-semibold">{demands.length}</p>
          <p className="mt-2 text-xs text-muted">Click to view demand list</p>
        </button>
      </div>

      <div className="card overflow-x-auto">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{view === "suppliers" ? "Supplier List" : "Demand List"}</h2>
          <p className="text-sm text-muted">Rows: {rows.length}</p>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <input
            className="input"
            placeholder={view === "suppliers" ? "Search agency/email/skill/state" : "Search org/email/location"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {view === "suppliers" ? (
            <select className="input" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="all">All States</option>
              {supplierStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          ) : (
            <div />
          )}
          {view === "suppliers" ? (
            <select className="input" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
              <option value="all">All Skills</option>
              {supplierSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-4 px-1 text-sm">
            <label className="inline-flex items-center gap-2">
              <input checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} type="checkbox" />
              Active only
            </label>
            <label className="inline-flex items-center gap-2">
              <input checked={mockOnly} onChange={(e) => setMockOnly(e.target.checked)} type="checkbox" />
              Mock only
            </label>
          </div>
        </div>

        {view === "suppliers" ? (
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="py-2">Agency</th>
                <th className="py-2">Email</th>
                <th className="py-2">Skill</th>
                <th className="py-2">State</th>
                <th className="py-2">Status</th>
                <th className="py-2">Mock</th>
                <th className="py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s) => (
                <tr className="border-b border-border" key={s.id}>
                  <td className="py-2">{s.agencyName || "-"}</td>
                  <td className="py-2">{s.email}</td>
                  <td className="py-2">{s.skill || "-"}</td>
                  <td className="py-2">{s.state || "-"}</td>
                  <td className="py-2">
                    <span className={s.status === "active" ? "status-badge status-active" : "status-badge status-inactive"}>{s.status}</span>
                  </td>
                  <td className="py-2">{s.isMockData ? "Yes" : "No"}</td>
                  <td className="py-2">
                    <button className="btn-secondary" type="button" onClick={() => setSelected({ type: "supplier", row: s })}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[950px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="py-2">Organization</th>
                <th className="py-2">Email</th>
                <th className="py-2">Location</th>
                <th className="py-2">Status</th>
                <th className="py-2">Mock</th>
                <th className="py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemands.map((d) => (
                <tr className="border-b border-border" key={d.id}>
                  <td className="py-2">{d.organizationName || "-"}</td>
                  <td className="py-2">{d.email}</td>
                  <td className="py-2">{d.defaultLocation || "-"}</td>
                  <td className="py-2">
                    <span className={d.status === "active" ? "status-badge status-active" : "status-badge status-inactive"}>{d.status}</span>
                  </td>
                  <td className="py-2">{d.isMockData ? "Yes" : "No"}</td>
                  <td className="py-2">
                    <button className="btn-secondary" type="button" onClick={() => setSelected({ type: "demand", row: d })}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selected.type === "supplier" ? "Supplier Details" : "Demand Details"}</h3>
              <button className="btn-secondary" type="button" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

            <div className="grid gap-3 text-sm md:grid-cols-2">
              {Object.entries(selected.row).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-border p-3">
                  <p className="text-xs uppercase text-muted">{key}</p>
                  <p className="mt-1 break-words">{String(value ?? "-")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
