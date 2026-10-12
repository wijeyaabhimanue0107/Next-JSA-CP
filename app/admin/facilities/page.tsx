"use client";

import { useState } from "react";
import Link from "next/link";

const initialFacilities = [
  { name: "Badminton Court 1", ground: "Independent", rate: "2,500" },
  { name: "Cricket Net 1", ground: "Shared turf", rate: "3,000" },
  { name: "Cricket Net 2", ground: "Shared turf", rate: "3,000" },
  { name: "Cricket Net 3", ground: "Shared turf", rate: "3,000" },
  { name: "Cricket Net 4", ground: "Shared turf", rate: "3,000" },
  { name: "Football Play Area", ground: "Shared turf", rate: "4,000" },
];

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState(initialFacilities);
  const [name, setName] = useState("");
  const [ground, setGround] = useState("Independent");
  const [rate, setRate] = useState("");

  function addFacility() {
    if (!name.trim() || !rate.trim()) return;
    setFacilities([...facilities, { name: name.trim(), ground, rate: rate.trim() }]);
    setName("");
    setRate("");
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><div className="eyebrow">JSA PLAY · MANAGEMENT</div><h1>Management dashboard</h1></div>
        <div className="admin-user">Admin <Link href="/">Log out</Link></div>
      </header>
      <nav className="admin-tabs" aria-label="Admin navigation">
        <a href="/admin">Overview</a><a href="#bookings">Bookings</a><a href="#schedule">Schedule</a><a className="active" href="/admin/facilities">Facilities</a><a href="#audit">Audit log</a>
      </nav>
      <section className="facility-admin">
        <div className="section-heading"><div><div className="eyebrow">INVENTORY</div><h2>Facilities</h2></div><span className="muted">{facilities.length} active facilities</span></div>
        <div className="table-wrap">
          <table><thead><tr><th>Facility</th><th>Ground</th><th>Rate (LKR)</th><th>Actions</th></tr></thead><tbody>
            {facilities.map((facility, index) => <tr key={`${facility.name}-${index}`}><td><strong>{facility.name}</strong></td><td>{facility.ground}</td><td>{facility.rate}</td><td className="actions"><button className="confirm-button" type="button">Edit</button><button className="danger-button" type="button" onClick={() => setFacilities(facilities.filter((_, itemIndex) => itemIndex !== index))}>Delete</button></td></tr>)}
          </tbody></table>
        </div>
        <div className="add-facility">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Facility name" aria-label="Facility name" />
          <select value={ground} onChange={(event) => setGround(event.target.value)} aria-label="Ground type"><option>Independent</option><option>Shared turf</option></select>
          <input value={rate} onChange={(event) => setRate(event.target.value)} placeholder="Rate / hour" aria-label="Rate per hour" />
          <button className="primary-button" type="button" onClick={addFacility}>Add facility</button>
        </div>
      </section>
    </main>
  );
}
