"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/client-auth";

export default function SupplierDashboardOverview() {
  const [profile, setProfile] = useState(null);
  const [nearbyRequirements, setNearbyRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const area = useMemo(() => String(profile?.state || "").trim(), [profile]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const profileRes = await authFetch("/api/supplier/profile");
        const profileData = await profileRes.json();
        if (!profileRes.ok) throw new Error(profileData.error || "Failed to fetch supplier profile.");

        const loadedProfile = profileData.profile || null;
        setProfile(loadedProfile);

        const params = new URLSearchParams();
        if (loadedProfile?.state?.trim()) params.set("state", loadedProfile.state.trim());
        if (loadedProfile?.skill?.trim()) params.set("skill", loadedProfile.skill.trim());

        const reqRes = await authFetch(`/api/supplier/requirements?${params.toString()}`);
        const reqData = await reqRes.json();
        if (!reqRes.ok) throw new Error(reqData.error || "Failed to fetch nearby requirements.");

        setNearbyRequirements((reqData.requirements || []).slice(0, 6));
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-5">
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">My Posted Availability</h2>
              <p className="text-sm text-muted">Your supplier profile details used by demand users.</p>
            </div>
            <Link className="btn-secondary" href="/supplier/profile">
              Edit
            </Link>
          </div>

          {loading ? <p className="text-sm text-muted">Loading your availability...</p> : null}

          {!loading && !profile ? (
            <p className="text-sm text-muted">No supplier profile found. Complete your profile to publish availability.</p>
          ) : null}

          {!loading && profile ? (
            <div className="rounded-lg border border-border p-3 text-sm">
              <p><span className="font-medium">Agency:</span> {profile.agencyName || "-"}</p>
              <p><span className="font-medium">Skill:</span> {profile.skill || "-"}</p>
              <p><span className="font-medium">Team Size:</span> {profile.teamSize || "-"}</p>
              <p><span className="font-medium">State:</span> {profile.state || "-"}</p>
              <p><span className="font-medium">Address:</span> {profile.address || "-"}</p>
            </div>
          ) : null}
        </section>

        <section className="card space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Requirements Near My Area</h2>
              <p className="text-sm text-muted">Area: {area || "Not set"}</p>
            </div>
            <Link className="btn-secondary" href="/supplier/profile">
              Update Area
            </Link>
          </div>

          {loading ? <p className="text-sm text-muted">Loading nearby requirements...</p> : null}

          {!loading && !area ? (
            <p className="text-sm text-muted">Set your state in profile to see nearby demand requirements.</p>
          ) : null}

          {!loading && area && !nearbyRequirements.length ? (
            <p className="text-sm text-muted">No nearby open requirements found.</p>
          ) : null}

          {!loading && nearbyRequirements.length ? (
            <div className="space-y-2">
              {nearbyRequirements.map((req) => (
                <div className="rounded-lg border border-border p-3" key={req.id}>
                  <p className="font-medium">{req.title || "Requirement"}</p>
                  <p className="text-sm text-muted">
                    {req.location || "Location not set"} | Qty {req.quantity || "-"}
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
