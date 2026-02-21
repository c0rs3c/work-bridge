import SiteShell from "@/components/site-shell";
import MockDataControls from "@/components/admin/mock-data-controls";

const links = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Entries", href: "/admin/entries" },
  { label: "Suppliers & Demand", href: "/admin/profiles" },
  { label: "Mock Data", href: "/admin/mock-data" }
];

export default function AdminMockDataPage() {
  return (
    <SiteShell title="Mock Data Controls" links={links}>
      <MockDataControls />
    </SiteShell>
  );
}
