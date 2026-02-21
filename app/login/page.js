import Link from "next/link";
import LoginForm from "@/components/auth/login-form";
import ThemeToggle from "@/components/theme-toggle";
import Image from "next/image";

const roleOptions = ["admin", "executive", "supplier", "demand"];

export default function LoginPage({ searchParams }) {
  const requestedRole = typeof searchParams?.role === "string" ? searchParams.role.toLowerCase() : "";
  const role = roleOptions.includes(requestedRole) ? requestedRole : "";
  const registerHref = role ? `/register?role=${role}` : "/register";

  return (
    <div className="min-h-screen">
      <div className="public-topbar">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Image src="/logo.jpg" alt="Work Bridge logo" width={22} height={22} className="brand-logo-img" />
            <span>Work Bridge</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="auth-shell">
        <div className="w-full max-w-md">
        <LoginForm lockedRole={role} />
        <p className="mt-3 text-center text-sm text-muted">
          New user? <Link className="text-brand underline" href={registerHref}>Register here</Link>
        </p>
      </div>
    </div>
    </div>
  );
}
