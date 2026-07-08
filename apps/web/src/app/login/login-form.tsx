"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

async function ensureProfileOnServer() {
  const response = await fetch("/api/profile/ensure", { method: "POST" });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Could not create profile");
  }
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/app";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      try {
        await ensureProfileOnServer();
      } catch (profileError) {
        setError(
          profileError instanceof Error
            ? profileError.message
            : "Signed in, but profile setup failed",
        );
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      try {
        await ensureProfileOnServer();
      } catch (profileError) {
        setError(
          profileError instanceof Error
            ? profileError.message
            : "Account created, but profile setup failed",
        );
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
      return;
    }

    setMessage(
      "Check your email to confirm your account, then log in. (You can disable email confirmation in Supabase Auth settings for local MVP.)",
    );
    setMode("login");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div className="flex gap-2 rounded-full border border-line bg-white/70 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full px-4 py-2 transition ${
            mode === "login"
              ? "bg-sakura-deep text-white"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full px-4 py-2 transition ${
            mode === "signup"
              ? "bg-sakura-deep text-white"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Sign up
        </button>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block text-ink-muted">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none ring-sakura-deep/30 focus:ring-2"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-ink-muted">Password</span>
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none ring-sakura-deep/30 focus:ring-2"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink-muted">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-sakura-deep px-5 py-3 text-sm font-medium text-white transition hover:bg-[#b34d58] disabled:opacity-60"
      >
        {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
      </button>

      <p className="text-center text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">
          ← Back to home
        </Link>
      </p>
    </form>
  );
}
