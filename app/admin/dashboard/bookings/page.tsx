"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import { bookings as seedBookings, type BookingStatus } from "@/data/bookings";
import { facilities } from "@/data/facilities";
import { addAuditEntry } from "@/data/auditLog";

export default function BookingsPage() {
  const [items, setItems] = useState(seedBookings);
  const [filter, setFilter] = useState<"All" | BookingStatus>("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const visible = items.filter((booking) => (filter === "All" || booking.status === filter) && `${booking.ref} ${booking.name}`.toLowerCase().includes(search.toLowerCase()));

  function update(ref: string, status: BookingStatus) {
    if (!window.confirm(`Are you sure you want to mark ${ref} as ${status.toLowerCase()}?`)) return;
    setItems((current) => current.map((booking) => booking.ref === ref ? { ...booking, status } : booking));
    addAuditEntry(`${status} booking`, ref);
    setMessage(`${ref} marked ${status.toLowerCase()}. Audit log entry added.`);
  }

  return <AdminShell><section className="admin-content"><div className="section-heading"><div><div className="eyebrow">OPERATIONS</div><h2>Bookings</h2></div><div className="table-tools"><input placeholder="Search ref or name" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search bookings" /><select value={filter} onChange={(event) => setFilter(event.target.value as "All" | BookingStatus)} aria-label="Filter booking status"><option>All</option><option>Pending</option><option>Confirmed</option><option>Rejected</option></select></div></div>{message && <div className="notice">{message}</div>}<div className="table-wrap"><table><thead><tr><th>Ref</th><th>Facility</th><th>When</th><th>Customer</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.map((booking) => { const facility = facilities.find((item) => item.id === booking.facilityId); return <tr key={booking.ref}><td className="ref">{booking.ref}</td><td>{facility?.name}</td><td>{booking.date}<br /><strong>{booking.startTime} – {booking.endTime}</strong></td><td><strong>{booking.name}</strong><br /><span>{booking.mobile} · {booking.email ?? "No email"}{booking.note && ` · ${booking.note}`}</span></td><td><span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></td><td className="actions">{booking.status === "Pending" && <><button className="confirm-button" type="button" onClick={() => update(booking.ref, "Confirmed")}>Confirm</button><button className="danger-button" type="button" onClick={() => update(booking.ref, "Rejected")}>Reject</button></>}</td></tr>; })}{visible.length === 0 && <tr><td colSpan={6} className="empty-cell">No bookings match your filters.</td></tr>}</tbody></table></div></section></AdminShell>;
}
