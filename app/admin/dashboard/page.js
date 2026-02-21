import SiteShell from "@/components/site-shell";
import AdminKpis from "@/components/admin/admin-kpis";

const links = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Entries", href: "/admin/entries" },
  { label: "Suppliers & Demand", href: "/admin/profiles" },
  { label: "Mock Data", href: "/admin/mock-data" }
];

export default function AdminDashboardPage() {
  return (
    <SiteShell title="Admin Dashboard" links={links}>
      <AdminKpis />
    </SiteShell>
  );
}
