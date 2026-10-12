"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ((username === "admin" || username === "manager") && password === "Admin@123") {
      sessionStorage.setItem("jsa-admin-auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Try admin / Admin@123.");
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <Link className="auth-brand" href="/">JSA <span>Play</span></Link>
        <div className="eyebrow">MANAGEMENT PORTAL</div>
        <h1>Admin login</h1>
        <p className="auth-copy">Sign in to manage bookings, schedules, and facilities.</p>
        <form onSubmit={login}>
          <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
          <label>Password
            <span className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></span>
          </label>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="primary-button full-width" type="submit">Log in</button>
        </form>
        <p className="auth-switch">Need an account? <Link href="/admin/signup">Sign up</Link></p>
        <Link className="back-link" href="/">← Back to player portal</Link>
      </div>
    </main>
  );
}
