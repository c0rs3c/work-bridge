"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/client-auth";

export default function AdminEntries() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch("/api/entries");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch entries.");
        setEntries(data.entries || []);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  return (
    <div className="card overflow-x-auto">
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            <th className="py-2">Agency</th>
            <th className="py-2">Skill</th>
            <th className="py-2">Team Size</th>
            <th className="py-2">Wage (INR)</th>
            <th className="py-2">Rating</th>
            <th className="py-2">Status</th>
            <th className="py-2">Entered By</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr className="border-b border-border" key={entry.id}>
              <td className="py-2">{entry.payload.agencyName || "-"}</td>
              <td className="py-2">{entry.payload.skill}</td>
              <td className="py-2">{entry.payload.teamSize}</td>
              <td className="py-2">{entry.payload.wageRateInRupee}</td>
              <td className="py-2">{"★".repeat(entry.payload.rating)}</td>
              <td className="py-2">{entry.status}</td>
              <td className="py-2">{entry.enteredBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
