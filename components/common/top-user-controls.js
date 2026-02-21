"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import LogoutButton from "@/components/common/logout-button";

export default function TopUserControls() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) return;
        if (mounted) setUser(data.user);
      } catch (_) {
        // Keep shell usable even if profile fetch fails.
      }
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      {user ? (
        <div className="user-chip">
          <p className="user-chip-name">{user.displayName || user.email}</p>
          <p className="user-chip-email">{user.email}</p>
        </div>
      ) : null}
      <LogoutButton />
    </div>
  );
}
