'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, fmt } from '../../lib/store';
import { apiRequest } from '../../lib/api';
import SlotGrid from '../../components/SlotGrid';


const TABS = [
  'Overview',
  'Requests',
  'Customers',
  'Bookings',
  'Schedule',
  'Facilities',
  'Audit log',
];


export default function Admin() {
  const r = useRouter();
  const { db, ready, update } = useStore();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState('Overview');
  const [fid, setFid] = useState('foot');
  const [date, setDate] = useState('');
  const [nf, setNf] = useState({ name: '', sport: 'Badminton', rate: '' });

  useEffect(() => {
    let active = true;
    apiRequest('/api/admin/me')
      .then((admin) => { if (active) setUser(admin?.username || 'JSA Management'); })
      .catch(() => { if (active) r.replace('/admin/login'); })
      .finally(() => { if (active) setAuthChecked(true); });
    setDate(new Date().toISOString().slice(0, 10));
    return () => { active = false; };
  }, [r]);

  if (!authChecked || !user || !ready) return <p role="status">Loading management dashboard…</p>;
  const fs = db.facilities.filter((f) => !f.deleted);
  const f = fs.find((x) => x.id === fid) || fs[0];
  const nameOf = (id) => db.facilities.find((x) => x.id === id)?.name || id;
  const pending = db.bookings.filter((b) => b.status === 'Pending');

  const setStatus = (b, status) =>
    update((d) => { d.bookings.find((x) => x.id === b.id).status = status; return d; }, `${status} booking ${b.id}`);

  function slot(h, s) {
    if (s.state === 'free') {
      const n = prompt('Customer name for a manual booking.\nLeave empty to lock this hour for maintenance.');
      if (n === null) return;
      const lock = !n.trim();
      update((d) => {
        d.bookings.push({ id: 'ADM-' + Date.now(), facilityId: f.id, sport: f.sport, name: lock ? 'Maintenance' : n.trim(), phone: '', date, hour: h, status: lock ? 'Locked' : 'Confirmed' });
        return d;
      }, `${lock ? 'Locked' : 'Manual booking'}: ${f.name} ${date} ${fmt(h)}`);
    } else if (s.booking) {
      if (confirm(`${s.reason}. Release this slot?`))
        update((d) => { d.bookings = d.bookings.filter((x) => x.id !== s.booking.id); return d; }, `Released: ${f.name} ${date} ${fmt(h)}`);
    } else alert(s.reason);
  }

  function addFacility(e) {
    e.preventDefault();
    if (!nf.name.trim() || !(+nf.rate > 0)) return alert('Enter a name and an hourly rate.');
    update((d) => {
      d.facilities.push({ id: 'f' + Date.now(), name: nf.name.trim(), sport: nf.sport, rate: +nf.rate, ground: nf.sport === 'Badminton' ? 'Independent' : 'Shared turf' });
      return d;
    }, `Added facility ${nf.name.trim()}`);
    setNf({ name: '', sport: 'Badminton', rate: '' });
  }

  const editRate = (x) => {
    const v = prompt(`New hourly rate for ${x.name} (LKR)`, x.rate);
    if (v && +v > 0) update((d) => { d.facilities.find((y) => y.id === x.id).rate = +v; return d; }, `Rate changed: ${x.name} to LKR ${+v}`);
  };
  const del = (x) => confirm(`Delete ${x.name}? It is soft-deleted and kept for 12 months.`) &&
    update((d) => { const y = d.facilities.find((z) => z.id === x.id); y.deleted = true; y.deletedAt = new Date().toISOString(); return d; }, `Deleted facility ${x.name}`);

  return (
    <>
      <div className="row">
        <h1>Management dashboard</h1>
        <span>{user} <button className="link" onClick={async () => { try { await apiRequest('/api/admin/logout', { method: 'POST' }); } finally { r.replace('/admin/login'); } }}>Log out</button></span>
      </div>
      <div className="tabs" role="tablist">
        {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === 'Overview' && (
        <div className="stats">
          <div className="card"><b>{fs.length}</b><span>Active facilities</span></div>
          <div className="card"><b>{pending.length}</b><span>Pending bookings</span></div>
          <div className="card"><b>2</b><span>Registered admins</span></div>
        </div>
      )}

      {tab === 'Bookings' && (
        <table className="tbl"><thead><tr><th>Ref</th><th>Facility</th><th>When</th><th>Customer</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {db.bookings.length === 0 && <tr><td colSpan="6" className="muted">No booking requests yet. Send one from the player page.</td></tr>}
          {db.bookings.map((b) => (
            <tr key={b.id}><td>{b.id}</td><td>{nameOf(b.facilityId)}</td><td>{b.date} {fmt(b.hour)}</td><td>{b.name}<br />{b.phone}{b.email && <div className="small">{b.email}</div>}{b.note && <p className="small muted">{b.note}</p>}</td><td>{b.status}</td>
              <td>{b.status === 'Pending' && <><button className="btn sm" onClick={() => setStatus(b, 'Confirmed')}>Confirm</button> <button className="btn sm red" onClick={() => setStatus(b, 'Rejected')}>Reject</button></>}</td></tr>
          ))}
        </tbody></table>
      )}

      {tab === 'Schedule' && f && (
        <>
          <div className="bar">
            <select value={f.id} onChange={(e) => setFid(e.target.value)}>{fs.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <p className="muted">Click a free hour to add a manual booking or lock it. Click a booked or locked hour to release it.</p>
          <SlotGrid admin f={f} date={date} bookings={db.bookings} onPick={slot} />
        </>
      )}

      {tab === 'Facilities' && (
        <>
          <table className="tbl"><thead><tr><th>Facility</th><th>Ground</th><th>Rate (LKR)</th><th>Actions</th></tr></thead><tbody>
            {fs.map((x) => <tr key={x.id}><td>{x.name}</td><td>{x.ground}</td><td>{x.rate.toLocaleString()}</td>
              <td><button className="btn sm" onClick={() => editRate(x)}>Edit</button> <button className="btn sm red" onClick={() => del(x)}>Delete</button></td></tr>)}
          </tbody></table>
          <form className="bar" onSubmit={addFacility}>
            <input placeholder="Facility name" value={nf.name} onChange={(e) => setNf({ ...nf, name: e.target.value })} />
            <select value={nf.sport} onChange={(e) => setNf({ ...nf, sport: e.target.value })}>{['Badminton', 'Cricket', 'Football'].map((s) => <option key={s}>{s}</option>)}</select>
            <input type="number" placeholder="Rate / hour" value={nf.rate} onChange={(e) => setNf({ ...nf, rate: e.target.value })} />
            <button className="btn">Add facility</button>
          </form>
        </>
      )}

      {tab === 'Audit log' && (
        <ul className="log">{db.audit.length === 0 ? <li className="muted">No actions logged yet.</li> : db.audit.map((a) => <li key={a.id}><time>{a.at}</time> {a.text}</li>)}</ul>
      )}
    </>
  );
}
