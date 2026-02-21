import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/theme-toggle";

const cards = [
  { label: "Admin", href: "/admin/dashboard", note: "Manage users, entries, and mock data" },
  { label: "Executive", href: "/executive/dashboard", note: "Create and manage labour entries" },
  { label: "Supplier", href: "/supplier/dashboard", note: "Maintain agency profile and availability" },
  { label: "Demand", href: "/demand/dashboard", note: "Post labour demand requirements" }
];

export default function HomePage() {
  return (
    <div className="home-gradient min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-6 flex justify-end">
          <ThemeToggle />
        </div>
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image src="/logo.jpg" alt="Work Bridge logo" width={64} height={64} className="brand-logo-img" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Work Bridge</h1>
          <p className="mt-3 text-muted">Internal operations now, marketplace ready next.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link className="btn-primary" href="/login">
              Login
            </Link>
            <Link className="btn-secondary" href="/register">
              Register
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link className="card hover:border-slate-400 dark:hover:border-slate-600" href={card.href} key={card.href}>
              <p className="text-lg font-semibold">{card.label}</p>
              <p className="mt-2 text-sm text-muted">{card.note}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
