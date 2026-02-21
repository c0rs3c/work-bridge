"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import { INDIA_STATES_AND_UTS } from "@/lib/india-states";

const roles = ["admin", "executive", "supplier", "demand"];

function titleCase(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function RegisterForm({ lockedRole = "" }) {
  const router = useRouter();
  const safeLockedRole = roles.includes(String(lockedRole || "").toLowerCase()) ? String(lockedRole).toLowerCase() : "";
  const [role, setRole] = useState(safeLockedRole || "supplier");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    agencyName: "",
    mobileNumber: "",
    landlineNumber: "",
    teamSize: "",
    skill: "",
    address: "",
    state: "",
    name: "",
    phone: "",
    region: "",
    organizationName: "",
    contactDetails: "",
    defaultLocation: ""
  });

  const fields = useMemo(() => {
    if (role === "admin") return [];

    if (role === "supplier") {
      return [
        ["agencyName", "Name of the agency"],
        ["landlineNumber", "Landline number"],
        ["teamSize", "Team size"],
        ["skill", "Skill"],
        ["address", "Address"],
        ["state", "State"]
      ];
    }

    if (role === "executive") {
      return [
        ["name", "Name"],
        ["phone", "Phone"],
        ["region", "Region"]
      ];
    }

    return [
      ["organizationName", "Organization name"],
      ["contactDetails", "Contact details"],
      ["defaultLocation", "Default location"]
    ];
  }, [role]);

  useEffect(() => {
    if (safeLockedRole) setRole(safeLockedRole);
  }, [safeLockedRole]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const bootstrapRes = await fetch("/api/users/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, role, profile })
      });
      const bootstrapData = await bootstrapRes.json();
      if (!bootstrapRes.ok) {
        throw new Error(bootstrapData.error || bootstrapData.errors?.[0] || "Registration failed.");
      }

      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) throw new Error(sessionData.error || "Could not start session.");

      router.push(`/${sessionData.role}/dashboard`);
    } catch (err) {
      setError(err.message || "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  const title = safeLockedRole ? `${titleCase(safeLockedRole)} Registration Page` : "Register";

  return (
    <form className="mx-auto w-full max-w-xl rounded-xl border border-border bg-card p-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-xs text-muted">Fields marked with * are mandatory.</p>
      <input className="input mt-4" placeholder="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input
        className="input mt-3"
        placeholder="Mobile number *"
        value={profile.mobileNumber}
        onChange={(e) => setProfile((prev) => ({ ...prev, mobileNumber: e.target.value }))}
        required
      />
      <div className="relative mt-3">
        <input
          className="input pr-10"
          placeholder="Password *"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-text"
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94" />
              <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.16 4.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <path d="M1 1l22 22" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {fields.map(([key, label]) => {
          if (key === "address") {
            return (
              <textarea
                key={key}
                className="input md:col-span-2"
                placeholder={label}
                value={profile[key]}
                onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.value }))}
                required={false}
                rows={3}
              />
            );
          }

          if (key === "state") {
            return (
              <select
                key={key}
                className="input"
                value={profile[key]}
                onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.value }))}
                required={false}
              >
                <option value="">Select State</option>
                {INDIA_STATES_AND_UTS.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            );
          }

          return (
            <input
              key={key}
              className="input"
              placeholder={label}
              value={profile[key]}
              onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.value }))}
              required={false}
            />
          );
        })}
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      <button className="btn-primary mt-3 w-full" type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Register"}
      </button>
      <GoogleAuthButton mode="register" role={role} />
    </form>
  );
}
