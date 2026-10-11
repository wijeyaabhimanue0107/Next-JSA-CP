'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAdmin } from '../../lib/admin-auth';

export default function Login() {
  const r = useRouter();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!u.trim() || !p) return setErr('Enter your username and password.');
    setBusy(true);
    try {
      await loginAdmin(u.trim(), p);
      r.replace('/admin');
    } catch (error) {
      setErr(error.status === 401 ? 'Username or password is incorrect.' : 'Admin sign-in is unavailable. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card login" onSubmit={submit} noValidate>
      <h1>Admin login</h1>
      <p className="muted">For Jaffna Sports Academy management.</p>
      {process.env.NODE_ENV !== 'production' && <p className="muted small">Temporary development login: Admin / Admin</p>}
      <label>Username<input value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" /></label>
      <label>Password
        <span className="pw">
          <input type={show ? 'text' : 'password'} value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" />
          <button type="button" className="link" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
        </span>
      </label>
      {err && <p className="note err" role="alert">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
      <p className="muted small">Need an account? <Link href="/admin/signup">Sign up</Link></p>
    </form>
  );
}
