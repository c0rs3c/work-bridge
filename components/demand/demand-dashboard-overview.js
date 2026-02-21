"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/client-auth";

export default function DemandDashboardOverview() {
  const [profile, setProfile] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [nearbySuppliers, setNearbySuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const area = useMemo(() => String(profile?.defaultLocation || "").trim(), [profile]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const [profileRes, requirementsRes] = await Promise.all([
          authFetch("/api/demand/profile"),
          authFetch("/api/demand/requirements")
        ]);

        const profileData = await profileRes.json();
        const requirementsData = await requirementsRes.json();

        if (!profileRes.ok) throw new Error(profileData.error || "Failed to fetch demand profile.");
        if (!requirementsRes.ok) throw new Error(requirementsData.error || "Failed to fetch requirements.");

        const loadedProfile = profileData.profile || null;
        const loadedRequirements = requirementsData.listings || [];

        setProfile(loadedProfile);
        setRequirements(loadedRequirements);

        const params = new URLSearchParams();
        if (loadedProfile?.defaultLocation?.trim()) {
          params.set("q", loadedProfile.defaultLocation.trim());
        }

        const suppliersRes = await authFetch(`/api/demand/suppliers?${params.toString()}`);
        const suppliersData = await suppliersRes.json();
        if (!suppliersRes.ok) throw new Error(suppliersData.error || "Failed to fetch suppliers.");

        setNearbySuppliers((suppliersData.suppliers || []).slice(0, 6));
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const openCount = requirements.filter((req) => req.status === "open").length;

  return (
    <div className="space-y-5">
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">My Posted Requirements</h2>
              <p className="text-sm text-muted">Total {requirements.length} | Open {openCount}</p>
            </div>
            <Link className="btn-secondary" href="/demand/listings">
              Manage
            </Link>
          </div>

          {loading ? <p className="text-sm text-muted">Loading requirements...</p> : null}

          {!loading && !requirements.length ? (
            <p className="text-sm text-muted">No requirements posted yet. Use Listings to post your first labour requirement.</p>
          ) : null}

          {!loading && requirements.length ? (
            <div className="space-y-2">
              {requirements.slice(0, 5).map((req) => (
                <div className="rounded-lg border border-border p-3" key={req.id}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{req.title}</p>
                    <span className={req.status === "open" ? "status-badge status-active" : "status-badge status-inactive"}>{req.status}</span>
                  </div>
                  <p className="text-sm text-muted">
                    {req.location} | Qty {req.quantity}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="card space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Availability Near My Area</h2>
              <p className="text-sm text-muted">Area: {area || "Not set"}</p>
            </div>
            <Link className="btn-secondary" href="/demand/profile">
              Update Area
            </Link>
          </div>

          {loading ? <p className="text-sm text-muted">Loading nearby availability...</p> : null}

          {!loading && !area ? (
            <p className="text-sm text-muted">Set your default location in profile to get nearby supplier availability.</p>
          ) : null}

          {!loading && area && !nearbySuppliers.length ? (
            <p className="text-sm text-muted">No nearby suppliers found for this area yet.</p>
          ) : null}

          {!loading && nearbySuppliers.length ? (
            <div className="space-y-2">
              {nearbySuppliers.map((supplier) => (
                <div className="rounded-lg border border-border p-3" key={supplier.id}>
                  <p className="font-medium">{supplier.agencyName || supplier.email}</p>
                  <p className="text-sm text-muted">
                    {supplier.skill || "Skill not set"} | Team {supplier.teamSize || "-"} | {supplier.state || "State not set"}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
