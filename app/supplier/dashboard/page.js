import SiteShell from "@/components/site-shell";

const links = [
  { label: "Dashboard", href: "/supplier/dashboard" },
  { label: "Profile", href: "/supplier/profile" }
];

export default function SupplierDashboardPage() {
  return (
    <SiteShell title="Supplier Dashboard" links={links}>
      <div className="flex justify-between card">
        <p className="text-sm text-muted">Manage labour availability and agency profile details.</p>
      </div>
    </SiteShell>
  );
}
