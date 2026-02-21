import SiteShell from "@/components/site-shell";
import ExecutiveEntryForm from "@/components/executive/entry-form";

const links = [
  { label: "Dashboard", href: "/executive/dashboard" },
  { label: "New Entry", href: "/executive/entries/new" },
  { label: "My Entries", href: "/executive/entries" }
];

export default function NewExecutiveEntryPage() {
  return (
    <SiteShell title="New Executive Entry" links={links}>
      <ExecutiveEntryForm />
    </SiteShell>
  );
}
