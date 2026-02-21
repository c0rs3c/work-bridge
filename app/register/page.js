import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";
import ThemeToggle from "@/components/theme-toggle";

export default function RegisterPage() {
  return (
    <div className="auth-shell">
      <div className="w-full max-w-5xl">
        <div className="mb-3 flex justify-end">
          <ThemeToggle />
        </div>
        <RegisterForm />
        <p className="mt-3 text-center text-sm text-muted">
          Already have an account? <Link className="text-brand underline" href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
