import Link from "next/link";
import LoginForm from "@/components/auth/login-form";
import ThemeToggle from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <div className="w-full max-w-md">
        <div className="mb-3 flex justify-end">
          <ThemeToggle />
        </div>
        <LoginForm />
        <p className="mt-3 text-center text-sm text-muted">
          New user? <Link className="text-brand underline" href="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
