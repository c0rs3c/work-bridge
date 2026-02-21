import SiteShell from "@/components/site-shell";
import ExecutiveEntriesList from "@/components/executive/entries-list";

const links = [
  { label: "Dashboard", href: "/executive/dashboard" },
  { label: "New Entry", href: "/executive/entries/new" },
  { label: "My Entries", href: "/executive/entries" }
];

export default function ExecutiveDashboardPage() {
  return (
    <SiteShell title="Executive Dashboard" links={links}>
      <div className="flex justify-between">
        <p className="text-sm text-muted">Create and monitor your labour entries.</p>
      </div>
      <ExecutiveEntriesList />
    </SiteShell>
  );
}
