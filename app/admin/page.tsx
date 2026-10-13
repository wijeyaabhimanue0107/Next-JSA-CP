"use client";

import { useState } from "react";
import Link from "next/link";

const bookings = [
  { ref: "JSA-8917", facility: "Badminton Court 1", when: "2026-10-09 06:00", customer: "hcdgjcfjg", contact: "+94 77 123 4567", status: "Pending" },
  { ref: "JSA-8918", facility: "Cricket Net 2", when: "2026-10-09 09:00", customer: "dgfsgsg", contact: "wijeyaabhimanue@gmail.com", status: "Pending" },
];

export default function AdminDashboard() {
  const [pending, setPending] = useState(bookings);
  const [message, setMessage] = useState("");

  function updateBooking(ref: string, action: "Confirmed" | "Rejected") {
    setPending((items) => items.filter((booking) => booking.ref !== ref));
    setMessage(`${ref} marked ${action.toLowerCase()}.`);
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <div className="eyebrow">JSA PLAY · MANAGEMENT</div>
          <h1>Management dashboard</h1>
        </div>
        <div className="admin-user">Admin <Link href="/">Log out</Link></div>
      </header>
      <nav className="admin-tabs" aria-label="Admin navigation">
        <a className="active" href="/admin">Overview</a>
        <a href="#bookings">Bookings</a>
        <a href="#schedule">Schedule</a>
        <a href="/admin/facilities">Facilities</a>
        <a href="#audit">Audit log</a>
      </nav>
      <section className="stats-grid">
        <div className="stat-card"><strong>6</strong><span>Active facilities</span></div>
        <div className="stat-card"><strong>{pending.length}</strong><span>Pending bookings</span></div>
        <div className="stat-card"><strong>2</strong><span>Registered admins</span></div>
      </section>
      <section className="admin-table-section" id="bookings">
        <div className="section-heading"><div><div className="eyebrow">NEEDS YOUR ATTENTION</div><h2>Booking requests</h2></div><button className="outline-button" type="button">Export</button></div>
        {message && <div className="notice" role="status">{message}</div>}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ref</th><th>Facility</th><th>When</th><th>Customer</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {pending.map((booking) => <tr key={booking.ref}><td className="ref">{booking.ref}</td><td>{booking.facility}</td><td>{booking.when}</td><td><strong>{booking.customer}</strong><br /><span>{booking.contact}</span></td><td><span className="status pending">{booking.status}</span></td><td className="actions"><button className="confirm-button" type="button" onClick={() => updateBooking(booking.ref, "Confirmed")}>Confirm</button><button className="danger-button" type="button" onClick={() => updateBooking(booking.ref, "Rejected")}>Reject</button></td></tr>)}
              {pending.length === 0 && <tr><td colSpan={6} className="empty-cell">No pending booking requests.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
