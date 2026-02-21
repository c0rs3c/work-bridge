import SiteShell from "@/components/site-shell";
import AdminSupplierDemandList from "@/components/admin/admin-supplier-demand-list";

const links = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Entries", href: "/admin/entries" },
  { label: "Suppliers & Demand", href: "/admin/profiles" },
  { label: "Mock Data", href: "/admin/mock-data" }
];

export default function AdminProfilesPage() {
  return (
    <SiteShell title="Suppliers And Demand" links={links}>
      <AdminSupplierDemandList />
    </SiteShell>
  );
}
