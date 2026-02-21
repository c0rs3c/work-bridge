import { auth } from "@/lib/firebase/client";

export async function getIdToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You are not logged in.");
  }
  return currentUser.getIdToken(true);
}

export async function authFetch(url, options = {}) {
  const token = await getIdToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  };
  return fetch(url, { ...options, headers });
}
