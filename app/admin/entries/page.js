import SiteShell from "@/components/site-shell";
import AdminEntries from "@/components/admin/admin-entries";

const links = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Entries", href: "/admin/entries" },
  { label: "Suppliers & Demand", href: "/admin/profiles" },
  { label: "Mock Data", href: "/admin/mock-data" }
];

export default function AdminEntriesPage() {
  return (
    <SiteShell title="All Entries" links={links}>
      <AdminEntries />
    </SiteShell>
  );
}
