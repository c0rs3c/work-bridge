"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

export default function GoogleAuthButton({ mode = "login" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createSession = async (token) => {
    const sessionRes = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token })
    });

    const sessionData = await sessionRes.json();
    if (sessionRes.ok) {
      router.push(`/${sessionData.role}/dashboard`);
      return true;
    }

    if (sessionRes.status === 404) {
      sessionStorage.setItem("lc_pending_google_token", token);
      router.push("/onboarding");
      return false;
    }

    throw new Error(sessionData.error || "Google sign-in failed.");
  };

  const onGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await createSession(token);
    } catch (err) {
      setError(err.message || "Could not sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button className="btn-secondary w-full" type="button" onClick={onGoogleSignIn} disabled={loading}>
        <span className="inline-flex items-center gap-2">
          {!loading ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.5 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.4l2.7-2.6C17 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.7-4.1 9.7-9.8 0-.7-.1-1.3-.2-2H12z" />
              <path fill="#34A853" d="M2 12c0 2.1.8 4.1 2.3 5.6l3.1-2.4c-.8-.7-1.4-1.9-1.4-3.2s.5-2.4 1.4-3.2L4.3 6.4A9.9 9.9 0 0 0 2 12z" />
              <path fill="#FBBC05" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.1-2.5c-.8.6-1.9 1-3.5 1-2.7 0-5.1-1.8-5.9-4.3l-3.2 2.5C4.4 19.8 7.9 22 12 22z" />
              <path fill="#4285F4" d="M21.7 12.2c0-.7-.1-1.3-.2-2H12v3.9h5.5c-.3 1.3-1 2.3-2 3l3.1 2.5c1.8-1.7 3.1-4.2 3.1-7.4z" />
            </svg>
          ) : null}
          {loading ? "Please wait..." : mode === "register" ? "Sign up with Google" : "Continue with Google"}
        </span>
      </button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
