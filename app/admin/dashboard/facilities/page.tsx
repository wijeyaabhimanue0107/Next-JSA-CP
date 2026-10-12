"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import { facilities as seedFacilities, type Facility, type Sport } from "@/data/facilities";
import { addAuditEntry } from "@/data/auditLog";

export default function FacilitiesPage() {
  const [items, setItems] = useState(seedFacilities);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [form, setForm] = useState({ name: "", sport: "Badminton" as Sport, rate: "" });
  const [message, setMessage] = useState("");
  const [editForm, setEditForm] = useState({ name: "", rate: "" });

  function addFacility() {
    if (!form.name.trim() || !Number(form.rate) || Number(form.rate) <= 0) return;
    const sport = form.sport;
    setItems((current) => [...current, { id: Math.max(...current.map((item) => item.id), 0) + 1, name: form.name.trim(), sport, ground: sport === "Badminton" ? "Independent" : "Shared turf", ratePerHour: Number(form.rate), features: [], location: "Jaffna Sports Academy, Jaffna", whatsapp: "+94 77 123 4567", openTime: "06:00", closeTime: "22:00" }]);
    setForm({ name: "", sport: "Badminton", rate: "" });
    addAuditEntry("Added facility", form.name.trim());
    setMessage("Facility added. Audit log entry added.");
  }

  function removeFacility(id: number) {
    if (!window.confirm("Delete this facility? It will be hidden from the player portal.")) return;
    setItems((current) => current.filter((item) => item.id !== id));
    addAuditEntry("Deleted facility", String(id));
    setMessage("Facility soft-deleted. Audit log entry added.");
  }

  return <AdminShell><section className="admin-content"><div className="section-heading"><div><div className="eyebrow">INVENTORY</div><h2>Facilities</h2></div><span className="muted">{items.length} active facilities</span></div>{message && <div className="notice">{message}</div>}<div className="table-wrap"><table><thead><tr><th>Facility</th><th>Ground</th><th>Rate (LKR)</th><th>Actions</th></tr></thead><tbody>{items.map((facility) => <tr key={facility.id}><td><strong>{facility.name}</strong><br /><span>{facility.sport} · {facility.openTime} – {facility.closeTime}</span></td><td>{facility.ground}</td><td>{facility.ratePerHour.toLocaleString("en-LK")}</td><td className="actions"><button className="confirm-button" type="button" onClick={() => { setEditing(facility); setEditForm({ name: facility.name, rate: String(facility.ratePerHour) }); }}>Edit</button><button className="danger-button" type="button" onClick={() => removeFacility(facility.id)}>Delete</button></td></tr>)}</tbody></table></div><div className="add-facility"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Facility name" aria-label="Facility name" /><select value={form.sport} onChange={(event) => setForm({ ...form, sport: event.target.value as Sport })} aria-label="Sport"><option>Badminton</option><option>Cricket</option><option>Football</option></select><input value={form.rate} onChange={(event) => setForm({ ...form, rate: event.target.value })} placeholder="Rate / hour" aria-label="Rate per hour" inputMode="numeric" /><button className="primary-button" type="button" onClick={addFacility}>Add facility</button></div></section>{editing && <div className="modal-backdrop" role="presentation" onClick={() => setEditing(null)}><div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="edit-facility-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setEditing(null)} type="button" aria-label="Close edit dialog">×</button><div className="eyebrow">EDIT FACILITY</div><h2 id="edit-facility-title">{editing.name}</h2><label className="modal-label">Facility name<input value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} /></label><label className="modal-label">Rate / hour<input value={editForm.rate} onChange={(event) => setEditForm({ ...editForm, rate: event.target.value })} type="number" min="1" /></label><button className="primary-button full-width" type="button" onClick={() => { if (!editForm.name.trim() || Number(editForm.rate) <= 0) return; setItems((current) => current.map((item) => item.id === editing.id ? { ...item, name: editForm.name.trim(), ratePerHour: Number(editForm.rate) } : item)); addAuditEntry("Edited facility", editForm.name.trim()); setEditing(null); setMessage("Facility updated. Audit log entry added."); }}>Save changes</button></div></div>}</AdminShell>;
}
