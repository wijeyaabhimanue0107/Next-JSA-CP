'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../lib/api';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/;

export default function AdminSignup() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!PASSWORD_RULE.test(form.password)) return setError('Use at least 12 characters with uppercase, lowercase, a number, and a symbol.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setBusy(true);
    try {
      await apiRequest('/api/admin/signup', { method: 'POST', body: JSON.stringify({ username: form.username.trim(), email: form.email.trim(), password: form.password }) });
      router.replace('/admin');
    } catch (err) {
      setError(err.message || 'Sign-up could not be completed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card login" onSubmit={submit}>
      <h1>Admin sign-up</h1>
      <p className="muted">Create a JSA management account.</p>
      <label>Username<input required autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>
      <label>Email<input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input required type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      <p className="muted small">At least 12 characters, with uppercase, lowercase, a number, and a symbol.</p>
      <label>Confirm password<input required type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></label>
      {error && <p className="note err" role="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      <p className="muted small">Already have access? <Link href="/admin/login">Log in</Link></p>
    </form>
  );
}