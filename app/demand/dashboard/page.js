import SiteShell from "@/components/site-shell";
import DemandDashboardOverview from "@/components/demand/demand-dashboard-overview";

const links = [
  { label: "Dashboard", href: "/demand/dashboard" },
  { label: "Profile", href: "/demand/profile" },
  { label: "Listings", href: "/demand/listings" }
];

export default function DemandDashboardPage() {
  return (
    <SiteShell title="Demand Dashboard" links={links}>
      <DemandDashboardOverview />
    </SiteShell>
  );
}
