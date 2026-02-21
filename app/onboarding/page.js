"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import ThemeToggle from "@/components/theme-toggle";

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState("supplier");
  const [idToken, setIdToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadToken() {
      const tokenFromSession = sessionStorage.getItem("lc_pending_google_token");
      if (tokenFromSession) {
        if (!cancelled) setIdToken(tokenFromSession);
        return;
      }

      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        if (!cancelled) {
          setIdToken(token);
          sessionStorage.setItem("lc_pending_google_token", token);
        }
      }
    }

    loadToken().catch((e) => setError(e.message || "Unable to prepare onboarding."));
    return () => {
      cancelled = true;
    };
  }, []);

  const completeOnboarding = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!idToken) {
        throw new Error("Missing onboarding session. Please sign in with Google again.");
      }

      const bootstrapRes = await fetch("/api/users/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, role, profile: {} })
      });
      const bootstrapData = await bootstrapRes.json();
      if (!bootstrapRes.ok) {
        throw new Error(bootstrapData.error || bootstrapData.errors?.[0] || "Onboarding failed.");
      }

      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) {
        throw new Error(sessionData.error || "Could not create session.");
      }

      sessionStorage.removeItem("lc_pending_google_token");
      router.push(`/${sessionData.role}/dashboard`);
    } catch (err) {
      setError(err.message || "Could not complete onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="w-full max-w-md">
        <div className="mb-3 flex justify-end">
          <ThemeToggle />
        </div>
        <form className="auth-card space-y-4" onSubmit={completeOnboarding}>
          <h1 className="text-xl font-semibold">Complete Account Setup</h1>
          <p className="text-sm text-muted">You signed in with Google. Choose your role now and fill other details later from dashboard.</p>

          <label className="block text-sm font-medium">Role</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="executive">executive</option>
            <option value="supplier">supplier</option>
            <option value="demand">demand</option>
          </select>

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <button className="btn-primary w-full" type="submit" disabled={loading || !idToken}>
            {loading ? "Please wait..." : "Continue"}
          </button>

          <p className="text-center text-sm text-muted">
            Need to restart? <Link className="text-brand underline" href="/login">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
