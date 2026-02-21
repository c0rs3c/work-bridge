import Link from "next/link";
import Image from "next/image";
import TopUserControls from "@/components/common/top-user-controls";

export default function SiteShell({ title, children, links = [] }) {
  return (
    <div>
      <div className="os-banner">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Work Bridge logo" width={24} height={24} className="brand-logo-img" />
          <p>Work Bridge</p>
        </div>
      </div>
      <div className="os-layout">
        <aside className="os-sidebar">
          <div className="os-brand">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="Work Bridge logo" width={28} height={28} className="brand-logo-img" />
              <span>Work Bridge</span>
            </Link>
          </div>
          <nav className="os-nav">
            {links.map((link) => (
              <Link className="os-nav-link" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="os-workspace">
          <div className="os-workspace-header">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <TopUserControls />
          </div>
          <div className="os-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
