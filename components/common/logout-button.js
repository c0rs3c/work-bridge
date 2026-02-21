"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";

export default function LogoutButton() {
  const router = useRouter();

  const onLogout = async () => {
    await signOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <button className="btn-secondary" onClick={onLogout} type="button">
      Logout
    </button>
  );
}
