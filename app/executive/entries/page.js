import SiteShell from "@/components/site-shell";
import ExecutiveEntriesList from "@/components/executive/entries-list";

const links = [
  { label: "Dashboard", href: "/executive/dashboard" },
  { label: "New Entry", href: "/executive/entries/new" },
  { label: "My Entries", href: "/executive/entries" }
];

export default function ExecutiveEntriesPage() {
  return (
    <SiteShell title="My Entries" links={links}>
      <ExecutiveEntriesList />
    </SiteShell>
  );
}
