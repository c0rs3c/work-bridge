"use client";

import { useState } from "react";
import { authFetch } from "@/lib/client-auth";

export default function MockDataControls() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const runAction = async (url) => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await authFetch(url, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed.");
      setMessage(JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card space-y-3">
      <p className="text-sm text-muted">
        Seed mock data: 50 suppliers, 50 demand accounts, 2 executives, and 60 executive entries (30 each). Delete removes only isMockData=true rows.
      </p>
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" type="button" disabled={loading} onClick={() => runAction("/api/admin/mock-data/seed")}>Seed Mock Data</button>
        <button className="btn-secondary" type="button" disabled={loading} onClick={() => runAction("/api/admin/mock-data/delete")}>Delete Mock Data</button>
      </div>
      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
