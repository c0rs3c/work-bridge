"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/client-auth";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("executive");
  const [error, setError] = useState("");

  const load = async () => {
    const res = await authFetch("/api/users/manage");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch users.");
    setUsers(data.users || []);
  };

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authFetch("/api/users/manage", {
        method: "POST",
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user.");
      setEmail("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeStatus = async (userId, status) => {
    try {
      const res = await authFetch("/api/users/manage", {
        method: "PATCH",
        body: JSON.stringify({ userId, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <form className="card flex flex-wrap items-end gap-3" onSubmit={createUser}>
        <div className="min-w-64 flex-1">
          <label className="mb-1 block text-sm">User email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Role</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="executive">executive</option>
            <option value="supplier">supplier</option>
            <option value="demand">demand</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button className="btn-primary" type="submit">
          Create / Update
        </button>
      </form>

      <div className="card overflow-x-auto">
        {error ? <p className="mb-2 text-sm text-danger">{error}</p> : null}
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr className="border-b border-border" key={u.id}>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.role}</td>
                <td className="py-2">
                  <span className={u.status === "active" ? "status-badge status-active" : "status-badge status-inactive"}>
                    {u.status}
                  </span>
                </td>
                <td className="py-2">
                  <button className="btn-secondary mr-2" type="button" onClick={() => changeStatus(u.id, "active")}>
                    Activate
                  </button>
                  <button className="btn-secondary" type="button" onClick={() => changeStatus(u.id, "inactive")}>
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
