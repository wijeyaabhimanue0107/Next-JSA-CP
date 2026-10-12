"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminSignup() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <main className="auth-shell">
      <div className="auth-card">
        <Link className="auth-brand" href="/">JSA <span>Play</span></Link>
        <div className="eyebrow">MANAGEMENT PORTAL</div>
        <h1>Admin sign up</h1>
        <p className="auth-copy">Create a demo management account. No server account is created.</p>
        {submitted ? <div className="notice">Sign-up request saved for this UI demo. <Link href="/admin/login">Return to login</Link>.</div> : (
          <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <label>Username<input required /></label>
            <label>Email<input type="email" required /></label>
            <label>Password<input type="password" minLength={8} required /></label>
            <div className="password-hints">Password must include at least 8 characters, upper/lowercase, a number, and a symbol.</div>
            <label>Confirm password<input type="password" minLength={8} required /></label>
            <button className="primary-button full-width" type="submit">Create account</button>
          </form>
        )}
        <p className="auth-switch">Already registered? <Link href="/admin/login">Log in</Link></p>
      </div>
    </main>
  );
}
