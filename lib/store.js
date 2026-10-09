'use client';
import { useEffect, useState, useCallback } from 'react';

export const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 - 21:00
export const fmt = (h) => `${String(h).padStart(2, '0')}:00`;
export const ACTIVE = ['Pending', 'Confirmed', 'Locked'];

const seed = {
  facilities: [
    { id: 'bad1', name: 'Badminton Court 1', sport: 'Badminton', rate: 2500, ground: 'Independent', amenities: ['BWF-standard court', 'Synthetic rubber mat', 'Indoor LED lighting', 'Rest area'] },
    { id: 'net1', name: 'Cricket Net 1', sport: 'Cricket', rate: 3000, ground: 'Shared turf', amenities: ['Practice net', 'Shared artificial turf'] },
    { id: 'net2', name: 'Cricket Net 2', sport: 'Cricket', rate: 3000, ground: 'Shared turf', amenities: ['Practice net', 'Shared artificial turf'] },
    { id: 'net3', name: 'Cricket Net 3', sport: 'Cricket', rate: 3000, ground: 'Shared turf', amenities: ['Practice net', 'Shared artificial turf'] },
    { id: 'net4', name: 'Cricket Net 4', sport: 'Cricket', rate: 3000, ground: 'Shared turf', amenities: ['Practice net', 'Shared artificial turf'] },
    { id: 'foot', name: 'Football Play Area', sport: 'Football', rate: 4000, ground: 'Shared turf', amenities: ['Futsal / mini-football ground', 'Artificial turf', 'Night floodlights', 'Changing rooms', 'Lockers'] },
  ],
  
  bookings: [],
  customers: [],
  audit: [],
};


/* Shared-ground rule (SRS 1.3 / Module 2): Cricket nets and Football use the same turf. */
export function slotState(f, date, hour, bookings) {
  const at = bookings.filter((b) => b.date === date && b.hour === hour && ACTIVE.includes(b.status));
  const own = at.find((b) => b.facilityId === f.id);
  if (own) {
    const locked = own.status === 'Locked';
    return { state: locked ? 'locked' : 'booked', reason: locked ? 'Locked for maintenance' : `Booked (${own.status})`, booking: own };
  }
  if (f.sport === 'Football' && at.some((b) => b.sport === 'Cricket'))
    return { state: 'shared', reason: 'Ground In Use (Cricket)' };
  if (f.sport === 'Cricket' && at.some((b) => b.sport === 'Football'))
    return { state: 'shared', reason: 'Ground In Use (Football)' };
  return { state: 'free', reason: 'Available' };
}

export function useStore() {
  const [db, setDb] = useState(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    
try {
  const s = localStorage.getItem('jsa_db');

  if (s) {
    const saved = JSON.parse(s);

    setDb({
      ...seed,
      ...saved,
      customers: saved.customers || [],
    });
  }
} catch (error) {
  console.error('Could not load saved data:', error);
}

    setReady(true);
  }, []);
  // update(fn, logText): fn mutates a cloned db; logText adds an audit-trail entry
  const update = useCallback((fn, log) => {
    setDb((d) => {
      const n = fn(structuredClone(d));
      if (log) n.audit.unshift({ id: Math.random(), at: new Date().toLocaleString(), text: log });
      try { localStorage.setItem('jsa_db', JSON.stringify(n)); } catch {}
      return n;
    });
  }, []);
  return { db, ready, update };
}
