import SiteShell from "@/components/site-shell";
import SupplierDashboardOverview from "@/components/supplier/supplier-dashboard-overview";

const links = [
  { label: "Dashboard", href: "/supplier/dashboard" },
  { label: "Profile", href: "/supplier/profile" }
];

export default function SupplierDashboardPage() {
  return (
    <SiteShell title="Supplier Dashboard" links={links}>
      <SupplierDashboardOverview />
    </SiteShell>
  );
}
