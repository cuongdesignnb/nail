"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@aeranailounge.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      const next = searchParams.get("next") || "/admin";
      router.push(next);
    } catch (err) {
      setError("A connection error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo emblem */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4E4D7] shadow-sm mb-4">
            <Image
              src="/aera-mark.svg"
              alt="Aera Logo"
              width={38}
              height={38}
              priority
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#756B63]">
            Console Gateway
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#2D211B] mt-2">
            Aera Nail Lounge
          </h1>
          <p className="mt-2 text-sm text-[#756B63]">
            Sign in as an Owner or Manager to access salon operations.
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-white px-8 py-10 rounded-[20px] border border-[#E9E0D8] shadow-[0_8px_30px_rgb(77,43,20,0.04)]">
          <form className="space-y-6" onSubmit={submit}>
            {error && (
              <div className="rounded-lg bg-[#FCE9E9] p-3 text-xs font-semibold text-[#C94F4F]">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#756B63]">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4.5 w-4.5 text-[#9C9188]" size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@aeranailounge.com"
                    className="block w-full rounded-lg border border-[#DDD3CA] bg-white py-2.5 pl-10 pr-3 text-sm text-[#2D211B] placeholder-[#B8A99C] transition-all focus:border-[#B76E45] focus:outline-none focus:ring-2 focus:ring-[#B76E45]/20"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#756B63]">
                  Security Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4.5 w-4.5 text-[#9C9188]" size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full rounded-lg border border-[#DDD3CA] bg-white py-2.5 pl-10 pr-3 text-sm text-[#2D211B] placeholder-[#B8A99C] transition-all focus:border-[#B76E45] focus:outline-none focus:ring-2 focus:ring-[#B76E45]/20"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#B76E45] text-sm font-bold tracking-wide text-white shadow-sm transition-all hover:bg-[#814429] focus:outline-none focus:ring-2 focus:ring-[#B76E45]/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Console
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info link */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs font-medium text-[#756B63] transition-colors hover:text-[#B76E45]"
          >
            ← Back to Aera Nail Lounge Public Site
          </a>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
