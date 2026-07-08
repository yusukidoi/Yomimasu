import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm uppercase tracking-[0.18em] text-sakura-deep">Account</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-3 text-ink-muted">
        Sign in to save vocabulary and track reading progress.
      </p>

      <Suspense fallback={<p className="mt-8 text-sm text-ink-muted">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
