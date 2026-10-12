"use client";

import Link from "next/link";
import { useState } from "react";
import TimeRangePicker, { type TimeRangeValue } from "@/components/TimeRangePicker";
import { bookings as seedBookings, type Booking } from "@/data/bookings";
import { facilities, type Facility } from "@/data/facilities";
import { getConflictMessage } from "@/lib/conflicts";
import { formatCurrency } from "@/lib/time";

const today = new Date().toISOString().slice(0, 10);
const emptyRange: TimeRangeValue = { start: null, end: null };

export default function Home() {
  const [sport, setSport] = useState("All");
  const [date, setDate] = useState(today);
  const [allBookings, setAllBookings] = useState(seedBookings);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [range, setRange] = useState<TimeRangeValue>(emptyRange);
  const [form, setForm] = useState({ name: "", mobile: "", email: "", note: "" });
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [details, setDetails] = useState<Facility | null>(null);

  const visibleFacilities = facilities.filter((facility) => !facility.isDeleted && (sport === "All" || facility.sport === sport));
  const currentFacility = facilities.find((facility) => facility.id === selectedFacility);
  const conflictMessage = currentFacility && range.start && range.end
    ? getConflictMessage(currentFacility, date, { start: range.start, end: range.end }, allBookings)
    : "";
  const formValid = Boolean(currentFacility && range.start && range.end && !conflictMessage && form.name.trim() && /^\+?[0-9\s-]{9,15}$/.test(form.mobile.trim()) && (!form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)));

  function openBooking(facility: Facility) {
    setSelectedFacility(facility.id);
    setRange(emptyRange);
    setFormError("");
    setSuccess("");
  }

  function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) return setFormError("Your name is required.");
    if (!/^\+?[0-9\s-]{9,15}$/.test(form.mobile.trim())) return setFormError("Enter a valid mobile number.");
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setFormError("Enter a valid email address.");
    if (!currentFacility || !range.start || !range.end || conflictMessage) return setFormError(conflictMessage || "Choose a valid time range.");

    const ref = `JSA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ref,
      facilityId: currentFacility.id,
      date,
      startTime: range.start,
      endTime: range.end,
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim() || undefined,
      note: form.note.trim() || undefined,
      status: "Pending",
    };
    setAllBookings((current) => [...current, newBooking]);
    setSuccess(`Request sent. Reference ${ref}. JSA management will contact you to confirm.`);
    setSelectedFacility(null);
    setRange(emptyRange);
    setForm({ name: "", mobile: "", email: "", note: "" });
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">JSA <span>Play</span></Link>
        <nav className="site-nav" aria-label="Main navigation">
          <a className="active" href="#availability">Book a slot</a>
          <Link href="/admin/login">Admin login</Link>
        </nav>
      </header>

      <section className="hero" id="availability">
        <div className="eyebrow">JAFFNA SPORTS ACADEMY · JAFFNA</div>
        <h1>Find your next game.</h1>
        <p>Pick a sport and date, choose your time range, and send a booking request. No account needed.</p>
        <div className="search-controls" aria-label="Availability filters">
          <label><span>Sport</span><select value={sport} onChange={(event) => setSport(event.target.value)}><option>All</option><option>Badminton</option><option>Cricket</option><option>Football</option></select></label>
          <label><span>Date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <button className="primary-button" type="button" onClick={() => setSuccess(`Availability checked for ${date}.`)}>Check availability</button>
        </div>
        {success && <div className="notice success-notice" role="status">{success}</div>}
      </section>

      <section className="facility-list" aria-label="Facilities">
        {visibleFacilities.map((facility) => {
          const isOpen = selectedFacility === facility.id;
          const unavailableRanges = allBookings
            .filter((booking) => booking.facilityId === facility.id && booking.date === date && booking.status !== "Rejected")
            .map((booking) => ({ start: booking.startTime, end: booking.endTime }));
          const facilityConflict = isOpen && range.start && range.end ? getConflictMessage(facility, date, { start: range.start, end: range.end }, allBookings) : "";
          const sharedGroundNote = facility.sport === "Football"
            ? "Shared ground restriction: booking Football locks all 4 Cricket Nets for this time."
            : facility.sport === "Cricket"
              ? "Shared ground restriction: booking any Cricket Net locks Football for this time slot."
              : "";

          return (
            <article className="facility-card" key={facility.id}>
              <div className="facility-card-top">
                <div>
                  <h2>{facility.name}</h2>
                  <p className="facility-meta">{formatCurrency(facility.ratePerHour)} / hour · {facility.location}</p>
                  <p className="features-line">{facility.features.join(" · ")}</p>
                  {sharedGroundNote && <p className="ground-note">{sharedGroundNote}</p>}
                </div>
                <div className="facility-links">
                  <a href={`https://wa.me/94771234567`} target="_blank" rel="noreferrer">WhatsApp {facility.whatsapp}</a>
                  <button type="button" onClick={() => setDetails(facility)}>Facility details</button>
                  <a href="https://www.google.com/maps/search/Jaffna+Sports+Academy" target="_blank" rel="noreferrer">View on map</a>
                </div>
              </div>
              <div className="facility-booking">
                <TimeRangePicker
                  openTime={facility.openTime}
                  closeTime={facility.closeTime}
                  stepMinutes={60}
                  value={isOpen ? range : emptyRange}
                  onChange={(value) => { setSelectedFacility(facility.id); setRange(value); setFormError(""); }}
                  unavailableRanges={unavailableRanges}
                  ratePerHour={facility.ratePerHour}
                />
                {facilityConflict && facilityConflict !== "Selected time overlaps an existing booking" && <div className="shared-conflict" role="alert">{facilityConflict}</div>}
                <button className="primary-button book-button" type="button" onClick={() => openBooking(facility)} disabled={!isOpen || !range.start || !range.end || Boolean(facilityConflict)}>
                  Book this range
                </button>
              </div>
              {isOpen && (
                <form className="booking-form" onSubmit={submitBooking}>
                  <div className="booking-summary">{range.start && range.end ? `${range.start} – ${range.end} on ${date}` : "Choose a time range above"}</div>
                  <div className="form-grid">
                    <label>Your name *<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
                    <label>Mobile number *<input value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} placeholder="+94 77 123 4567" required /></label>
                    <label>Email (optional)<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
                    <label>Note (optional)<input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
                  </div>
                  {formError && <div className="range-error" role="alert">{formError}</div>}
                  <button className="primary-button" type="submit" disabled={!formValid}>Send booking request</button>
                </form>
              )}
            </article>
          );
        })}
      </section>

      <footer className="site-footer"><span>JSA Play · Simple court booking for everyone</span><span>Need help? +94 77 123 4567</span></footer>

      {details && (
        <div className="modal-backdrop" role="presentation" onClick={() => setDetails(null)}>
          <div className="booking-modal details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setDetails(null)} aria-label="Close details">×</button>
            <div className="eyebrow">FACILITY DETAILS</div>
            <h2 id="details-title">{details.name}</h2>
            <p>{formatCurrency(details.ratePerHour)} / hour · {details.location}</p>
            <h3>Features</h3>
            <ul>{details.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <a className="primary-button inline-button" href={`https://wa.me/94771234567`} target="_blank" rel="noreferrer">Contact on WhatsApp</a>
          </div>
        </div>
      )}
    </main>
  );
}
