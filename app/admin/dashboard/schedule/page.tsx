"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import TimeRangePicker, { type TimeRangeValue } from "@/components/TimeRangePicker";
import { bookings, type Booking } from "@/data/bookings";
import { facilities } from "@/data/facilities";
import { getConflictMessage } from "@/lib/conflicts";
import { addAuditEntry } from "@/data/auditLog";
import { durationMinutes } from "@/lib/time";

export default function SchedulePage() {
  const [facilityId, setFacilityId] = useState(1);
  const [date, setDate] = useState("2026-10-09");
  const [range, setRange] = useState<TimeRangeValue>({ start: null, end: null });
  const [mode, setMode] = useState<"Booking" | "Maintenance">("Booking");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [reason, setReason] = useState("");
  const [items, setItems] = useState<Booking[]>(bookings);
  const [message, setMessage] = useState("");
  const facility = facilities.find((item) => item.id === facilityId) ?? facilities[0];
  const dayItems = items.filter((item) => item.facilityId === facilityId && item.date === date && item.status !== "Rejected");
  const unavailable = dayItems.map((item) => ({ start: item.startTime, end: item.endTime }));
  const conflictMessage = range.start && range.end ? getConflictMessage(facility, date, { start: range.start, end: range.end }, items) : "";
  const canSubmit = Boolean(range.start && range.end && (mode === "Booking" ? name.trim() && /^\+?[0-9\s-]{9,15}$/.test(mobile.trim()) : reason.trim()) && !conflictMessage && !unavailable.some((item) => range.start && range.end && durationMinutes(range.start, range.end) > 0 && range.start < item.end && item.start < range.end));

  function addScheduleItem() {
    if (!canSubmit || !range.start || !range.end) return;
    const ref = mode === "Booking" ? `JSA-${Math.floor(1000 + Math.random() * 9000)}` : `LOCK-${Date.now().toString().slice(-4)}`;
    setItems((current) => [...current, { ref, facilityId, date, startTime: range.start as string, endTime: range.end as string, name: mode === "Booking" ? name : "Maintenance lock", mobile, reason: mode === "Maintenance" ? reason : undefined, status: "Confirmed", kind: mode }]);
    addAuditEntry(mode === "Booking" ? "Added manual booking" : "Added maintenance lock", ref);
    setMessage(`${mode} added to the schedule.`);
    setRange({ start: null, end: null });
    setName("");
    setMobile("");
    setReason("");
  }

  return <AdminShell><section className="admin-content"><div className="section-heading"><div><div className="eyebrow">OPERATIONS</div><h2>Schedule</h2></div></div><div className="schedule-controls"><label>Facility<select value={facilityId} onChange={(event) => setFacilityId(Number(event.target.value))}>{facilities.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label></div><section className="admin-panel schedule-list"><h3>{facility.name} · {date}</h3>{dayItems.length ? dayItems.map((item) => <div className="schedule-row" key={item.ref}><strong>{item.startTime} – {item.endTime}</strong><span>{item.kind === "Maintenance" ? item.reason : item.name}</span><span className={`status ${item.kind === "Maintenance" ? "maintenance-status" : "confirmed"}`}>{item.kind === "Maintenance" ? "Maintenance" : item.status}</span></div>) : <p className="muted">No bookings or maintenance locks for this day.</p>}</section><section className="admin-panel schedule-action"><div className="mode-tabs"><button className={mode === "Booking" ? "active" : ""} onClick={() => setMode("Booking")} type="button">Add manual booking</button><button className={mode === "Maintenance" ? "active" : ""} onClick={() => setMode("Maintenance")} type="button">Lock for maintenance</button></div><TimeRangePicker openTime={facility.openTime} closeTime={facility.closeTime} stepMinutes={60} value={range} onChange={setRange} unavailableRanges={unavailable} ratePerHour={facility.ratePerHour} />{conflictMessage && <div className="shared-conflict" role="alert">{conflictMessage}</div>}{mode === "Booking" ? <div className="form-grid"><label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Customer name" /></label><label>Mobile<input value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="+94 77 123 4567" /></label></div> : <label>Reason<input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Maintenance reason" /></label>}<button className="primary-button" type="button" disabled={!canSubmit} onClick={addScheduleItem}>{mode === "Booking" ? "Add manual booking" : "Lock time range"}</button>{message && <div className="notice">{message}</div>}</section></section></AdminShell>;
}
