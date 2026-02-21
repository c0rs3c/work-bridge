import SiteShell from "@/components/site-shell";
import AdminUsers from "@/components/admin/admin-users";

const links = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Entries", href: "/admin/entries" },
  { label: "Suppliers & Demand", href: "/admin/profiles" },
  { label: "Mock Data", href: "/admin/mock-data" }
];

export default function AdminUsersPage() {
  return (
    <SiteShell title="Manage Users" links={links}>
      <AdminUsers />
    </SiteShell>
  );
}
