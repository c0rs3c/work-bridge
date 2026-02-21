import SiteShell from "@/components/site-shell";
import DemandProfileForm from "@/components/demand/profile-form";

const links = [
  { label: "Dashboard", href: "/demand/dashboard" },
  { label: "Profile", href: "/demand/profile" }
];

export default function DemandProfilePage() {
  return (
    <SiteShell title="Demand Profile" links={links}>
      <DemandProfileForm />
    </SiteShell>
  );
}
