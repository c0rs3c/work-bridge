import SiteShell from "@/components/site-shell";

const links = [
  { label: "Dashboard", href: "/demand/dashboard" },
  { label: "Profile", href: "/demand/profile" }
];

export default function DemandDashboardPage() {
  return (
    <SiteShell title="Demand Dashboard" links={links}>
      <div className="flex justify-between card">
        <p className="text-sm text-muted">Post labour requirements and shortlist suppliers (phase 2).</p>
      </div>
    </SiteShell>
  );
}
