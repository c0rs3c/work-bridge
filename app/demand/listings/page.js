import SiteShell from "@/components/site-shell";
import DemandMarketplace from "@/components/demand/demand-marketplace";

const links = [
  { label: "Dashboard", href: "/demand/dashboard" },
  { label: "Profile", href: "/demand/profile" },
  { label: "Listings", href: "/demand/listings" }
];

export default function DemandListingsPage() {
  return (
    <SiteShell title="Demand Listings And Supplier Search" links={links}>
      <DemandMarketplace />
    </SiteShell>
  );
}
