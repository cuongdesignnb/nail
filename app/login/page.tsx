"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@aeranailounge.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
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
    router.push("/admin/settings/about");
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <span>Admin Access</span>
        <h1>Aera Nail Lounge</h1>
        <p>Sign in as an Owner or Manager to edit website content.</p>
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="AeraAdmin123!" /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-btn" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
      </form>
    </main>
  );
}
