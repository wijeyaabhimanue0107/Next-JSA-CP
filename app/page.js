'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore, slotState, fmt } from '../lib/store';
import SlotGrid from '../components/SlotGrid';

const CONTACT = '+94 77 123 4567';

export default function Home() {
  const { db, update } = useStore();
  const [sport, setSport] = useState('All');
  const [date, setDate] = useState('');
  const [q, setQ] = useState(null);
  const [pick, setPick] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const d = new Date().toISOString().slice(0, 10);
    setDate(d); setQ({ sport: 'All', date: d });
  }, []);

  const list = q ? db.facilities.filter((f) => !f.deleted && (q.sport === 'All' || f.sport === q.sport)) : [];

  function submit(e) {
    e.preventDefault();
    const { f, h } = pick;
    const s = slotState(f, q.date, h, db.bookings);
    if (s.state !== 'free') return setMsg({ err: true, text: s.reason });
    if (!form.name.trim() || !/^(?:\+94|0)?7\d{8}$/.test(form.phone.replace(/[\s()-]/g, '')))
      return setMsg({ err: true, text: 'Enter your name and a Sri Lankan mobile number, such as +94 77 123 4567.' });
    const ref = 'JSA-' + Math.floor(1000 + Math.random() * 9000);
    update((d) => {
      d.bookings.push({ id: ref, facilityId: f.id, sport: f.sport, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), note: form.note.trim(), date: q.date, hour: h, status: 'Pending' });
      return d;
    }, `New booking request ${ref}: ${f.name} ${q.date} ${fmt(h)}`);
    setMsg({ text: `Request ${ref} sent for ${f.name}, ${q.date} at ${fmt(h)}. Your request is pending; JSA will confirm it by phone.` });
    setPick(null); setForm({ name: '', phone: '', email: '', note: '' });
  }

  return (
    <>
      <p className="eyebrow">JAFFNA SPORTS ACADEMY · JAFFNA</p>
      <h1>Find your next game.</h1>
      <p className="muted">Pick a sport and date, choose a free hour, and send a booking request. No account needed.</p>

      <form className="bar" onSubmit={(e) => { e.preventDefault(); setQ({ sport, date }); setPick(null); setMsg(null); }}>
        <select value={sport} onChange={(e) => setSport(e.target.value)} aria-label="Sport">
          {['All', 'Badminton', 'Cricket', 'Football'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" required />
        <button className="btn">Check availability</button>
      </form>

      {msg && <p className={msg.err ? 'note err' : 'note ok'} role="status">{msg.text}</p>}

      {list.map((f) => (
        <section className="card" key={f.id}>
          <div className="row">
            <div>
              <h2>{f.name}</h2>
              <p className="muted">LKR {f.rate.toLocaleString()} / hour · Jaffna Sports Academy, Jaffna</p>
              {f.ground !== 'Independent' && <p className="warn">Shared ground restriction: {f.sport === 'Football' ? 'booking Football locks all 4 Cricket Nets for this time slot.' : 'booking any Cricket Net locks Football for this time slot.'}</p>}
              <p className="amenities">{(f.amenities || []).join(' · ')}</p>
            </div>
            <div className="links">
              <a href={`https://wa.me/${CONTACT.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp {CONTACT}</a>
              <Link href={`/facilities/${f.id}`}>Facility details</Link>
              <a href="https://www.google.com/maps/search/Jaffna+Sports+Academy" target="_blank" rel="noreferrer">View on map</a>
            </div>
          </div>
          <SlotGrid f={f} date={q.date} bookings={db.bookings} selected={pick && pick.f.id === f.id ? pick.h : null}
            onPick={(h) => { setPick({ f, h }); setMsg(null); }} />
          {pick && pick.f.id === f.id && (
            <form className="bar book" onSubmit={submit}>
              <strong>{fmt(pick.h)} on {q.date}</strong>
              <label className="field">Your name<input autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label className="field">Mobile number<input type="tel" autoComplete="tel" placeholder="+94 77 123 4567" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              <label className="field">Email (optional)<input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label className="field">Note (optional)<input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
              <button className="btn">Send booking request</button>
            </form>
          )}
        </section>
      ))}
      <p className="legend"><i className="slot free" /> Available <i className="slot booked" /> Booked <i className="slot locked" /> Maintenance lock <i className="slot shared" /> Ground in use</p>
    </>
  );
}
