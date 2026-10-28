"use client";

import { useState } from "react";

const sports = [
  { name: "Badminton", icon: "🏸", description: "1 Court" },
  { name: "Cricket", icon: "🏏", description: "4 Practice Nets" },
  { name: "Football", icon: "⚽", description: "Futsal Ground" },
];

const facilities: Record<string, string[]> = {
  Badminton: ["Badminton Court"],
  Cricket: [
    "Practice Net 1",
    "Practice Net 2",
    "Practice Net 3",
    "Practice Net 4",
  ],
  Football: ["Futsal / Mini-Football Ground"],
};

const slots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

export default function BookingPage() {
  const [sport, setSport] = useState("Badminton");
  const [facility, setFacility] = useState("Badminton Court");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  function selectSport(name: string) {
    setSport(name);
    setFacility(facilities[name][0]);
    setTime("");
    setMessage("");
  }

  function confirmBooking() {
    if (!date || !time) {
      setMessage("Please select a date and time slot.");
      return;
    }

    setMessage(
      `Demo selection: ${facility} on ${date} at ${time}. Connect the booking API to save your reservation.`
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <a href="/booking" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-2xl">
              🏆
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-emerald-800">
                JSAPlay
              </h1>
              <p className="text-xs text-slate-500">
                Jaffna Sports Academy
              </p>
            </div>
          </a>

          <span className="hidden text-sm font-medium text-slate-600 sm:block">
            Your game, your time.
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-emerald-900 px-5 py-12 text-white md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Book • Play • Repeat
          </p>

          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
            Your next game
            <br />
            starts here.
          </h2>

          <p className="mt-4 max-w-xl leading-7 text-emerald-100">
            Discover sports facilities at Jaffna Sports Academy.
            Check availability and choose your preferred playing time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-4 py-2">
              🏸 Badminton
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              🏏 Cricket
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              ⚽ Football
            </span>
          </div>
        </div>
      </section>

      {/* Booking Content */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Book your facility</h2>
          <p className="mt-2 text-slate-500">
            Select your sport, choose a date, and pick a time slot.
          </p>
        </div>

        {/* Sports Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {sports.map((item) => (
            <button
              key={item.name}
              onClick={() => selectSport(item.name)}
              className={`rounded-2xl border-2 p-5 text-left transition hover:-translate-y-1 hover:shadow-md ${
                sport === item.name
                  ? "border-emerald-600 bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">{item.icon}</span>

                {sport === item.name && (
                  <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">
                    Selected
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-lg font-bold">{item.name}</h3>

              <p className="mt-1 text-sm text-slate-500">
                {item.description}
              </p>
            </button>
          ))}
        </div>

        {/* Booking Form */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-xl font-bold">Choose your slot</h3>

            <p className="mt-2 text-sm text-slate-500">
              Select your facility and preferred date.
            </p>

            {/* Facility */}
            <label
              htmlFor="facility"
              className="mb-2 mt-6 block text-sm font-semibold"
            >
              Sports facility
            </label>

            <select
              id="facility"
              value={facility}
              onChange={(e) => {
                setFacility(e.target.value);
                setTime("");
                setMessage("");
              }}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              {facilities[sport].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Date */}
            <label
              htmlFor="booking-date"
              className="mb-2 mt-6 block text-sm font-semibold"
            >
              Select date
            </label>

            <input
              id="booking-date"
              type="date"
              min={new Date().toLocaleDateString("en-CA")}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
                setMessage("");
              }}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            {/* Time Slots */}
            <div className="mb-4 mt-8 flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-bold">Available time slots</h4>

              <span className="text-xs text-slate-500">
                Select one time
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setTime(slot);
                    setMessage("");
                  }}
                  aria-pressed={time === slot}
                  className={`rounded-xl border p-3 text-sm font-semibold transition ${
                    time === slot
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              These are demonstration slots, not live availability.
              Actual availability must be retrieved from the backend.
            </p>
          </div>

          {/* Summary */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold">Booking summary</h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-3 border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">Sport</span>
                <span className="text-right text-sm font-semibold">
                  {sport}
                </span>
              </div>

              <div className="flex justify-between gap-3 border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">Facility</span>
                <span className="max-w-40 text-right text-sm font-semibold">
                  {facility}
                </span>
              </div>

              <div className="flex justify-between gap-3 border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">Date</span>
                <span className="text-right text-sm font-semibold">
                  {date || "Not selected"}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-sm text-slate-500">Time</span>
                <span className="text-right text-sm font-semibold">
                  {time || "Not selected"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={confirmBooking}
              className="mt-8 w-full rounded-xl bg-emerald-700 px-5 py-4 font-bold text-white transition hover:bg-emerald-800"
            >
              Confirm Booking →
            </button>

            {message && (
              <p
                role="status"
                className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"
              >
                {message}
              </p>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Check the details before proceeding with your reservation.
            </p>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-6">
        <p className="text-center text-sm text-slate-500">
          © 2026 JSAPlay | Jaffna Sports Academy
        </p>
      </footer>
    </main>
  );
}