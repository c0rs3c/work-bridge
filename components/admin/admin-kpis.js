"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/client-auth";

export default function AdminKpis() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await authFetch("/api/admin/kpis");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load KPIs.");
        if (mounted) setData(json);
      } catch (err) {
        if (mounted) setError(err.message);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (!data) return <p className="text-sm text-muted">Loading KPIs...</p>;

  const cards = [
    ["Total Users", data.totalUsers],
    ["Active Executives", data.activeExecutives],
    ["Total Entries", data.totalEntries],
    ["Pending Verification", data.pendingVerification]
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map(([label, value]) => (
        <div className="card" key={label}>
          <p className="text-xs uppercase text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}
