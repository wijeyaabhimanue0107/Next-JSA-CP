"use client";

import { useState } from "react";
import Link from "next/link";

type Slot = {
  time: string;
  status: "Available" | "Booked" | "Maintenance";
};

type Facility = {
  name: string;
  sport: string;
  rate: string;
  description: string;
  ground: string;
  slots: Slot[];
};

const slots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

const facilities: Facility[] = [
  {
    name: "Badminton Court 1",
    sport: "Badminton",
    rate: "LKR 2,500 / hour",
    description: "Jaffna Sports Academy, Jaffna",
    ground: "Independent court",
    slots: slots.map((time, index) => ({ time, status: index === 3 || index === 9 ? "Booked" : "Available" })),
  },
  {
    name: "Cricket Net 1",
    sport: "Cricket",
    rate: "LKR 3,000 / hour",
    description: "Jaffna Sports Academy, Jaffna",
    ground: "Shared turf · book any cricket net for this time slot",
    slots: slots.map((time, index) => ({ time, status: index === 5 ? "Booked" : "Available" })),
  },
  {
    name: "Football Play Area",
    sport: "Football",
    rate: "LKR 4,000 / hour",
    description: "Jaffna Sports Academy, Jaffna",
    ground: "Shared turf · football bookings reserve the cricket nets",
    slots: slots.map((time, index) => ({ time, status: index === 2 || index === 10 ? "Booked" : "Available" })),
  },
];

export default function Home() {
  const [sport, setSport] = useState("All");
  const [date, setDate] = useState("2026-10-09");
  const [selected, setSelected] = useState<{ facility: Facility; time: string } | null>(null);
  const [notice, setNotice] = useState("");

  const visibleFacilities = sport === "All" ? facilities : facilities.filter((facility) => facility.sport === sport);

  function chooseSlot(facility: Facility, slot: Slot) {
    if (slot.status !== "Available") return;
    setSelected({ facility, time: slot.time });
    setNotice("");
  }

  function submitBooking() {
    setNotice(`Booking request for ${selected?.facility.name} at ${selected?.time} has been submitted.`);
    setSelected(null);
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">JSA <span>Play</span></Link>
        <nav className="site-nav" aria-label="Main navigation">
          <a className="active" href="#availability">Book a slot</a>
          <Link href="/admin">Admin login</Link>
        </nav>
      </header>

      <section className="hero" id="availability">
        <div className="eyebrow">JAFFNA SPORTS ACADEMY · JAFFNA</div>
        <h1>Find your next game.</h1>
        <p>Pick a sport and date, choose a free hour, and send a booking request. No account needed.</p>

        <div className="search-controls" aria-label="Availability filters">
          <label>
            <span>Sport</span>
            <select value={sport} onChange={(event) => setSport(event.target.value)}>
              <option>All</option>
              <option>Badminton</option>
              <option>Cricket</option>
              <option>Football</option>
            </select>
          </label>
          <label>
            <span>Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <button className="primary-button" type="button" onClick={() => setNotice(`Showing availability for ${date}.`)}>
            Check availability
          </button>
        </div>
        {notice && <div className="notice" role="status">{notice}</div>}
      </section>

      <section className="facility-list" aria-label="Facilities">
        {visibleFacilities.map((facility) => (
          <article className="facility-card" key={facility.name}>
            <div className="facility-card-top">
              <div>
                <h2>{facility.name}</h2>
                <p className="facility-meta">{facility.rate} · {facility.description}</p>
                <p className="ground-note">{facility.ground}</p>
              </div>
              <div className="facility-links">
                <a href="https://wa.me/94772234567" target="_blank" rel="noreferrer">WhatsApp · +94 77 223 4567</a>
                <a href="#details">Facility details</a>
                <a href="#map">View on map</a>
              </div>
            </div>
            <div className="slot-grid">
              {facility.slots.map((slot) => (
                <button
                  className={`slot ${slot.status.toLowerCase()}`}
                  disabled={slot.status !== "Available"}
                  key={slot.time}
                  onClick={() => chooseSlot(facility, slot)}
                  type="button"
                >
                  <strong>{slot.time}</strong>
                  <span>{slot.status}</span>
                </button>
              ))}
            </div>
          </article>
        ))}
        {visibleFacilities.length === 0 && <div className="empty-state">No facilities found for this sport.</div>}
      </section>

      <footer className="site-footer">
        <span>JSA Play · Simple court booking for everyone</span>
        <span>Need help? +94 77 223 4567</span>
      </footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close booking dialog">×</button>
            <div className="eyebrow">BOOKING REQUEST</div>
            <h2 id="booking-title">{selected.facility.name}</h2>
            <p>{selected.time} · {date} · {selected.facility.rate}</p>
            <label className="modal-label">Your name<input placeholder="Enter your name" /></label>
            <label className="modal-label">Phone or email<input placeholder="How can we contact you?" /></label>
            <button className="primary-button full-width" type="button" onClick={submitBooking}>Send booking request</button>
            <small>No payment is taken online. The academy will confirm your request.</small>
          </div>
        </div>
      )}
    </main>
  );
}
