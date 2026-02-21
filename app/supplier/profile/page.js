import SiteShell from "@/components/site-shell";
import SupplierProfileForm from "@/components/supplier/profile-form";

const links = [
  { label: "Dashboard", href: "/supplier/dashboard" },
  { label: "Profile", href: "/supplier/profile" }
];

export default function SupplierProfilePage() {
  return (
    <SiteShell title="Supplier Profile" links={links}>
      <SupplierProfileForm />
    </SiteShell>
  );
}
