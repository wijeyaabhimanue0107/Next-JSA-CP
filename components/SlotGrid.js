'use client';
import { HOURS, fmt, slotState } from '../lib/store';

export default function SlotGrid({ f, date, bookings, onPick, selected, admin }) {
  return (
    <div className="slots">
      {HOURS.map((h) => {
        const s = slotState(f, date, h, bookings);
        const status = s.state === 'free' ? 'Available' : s.reason;
        return (
          <button
            key={h}
            type="button"
            title={`${fmt(h)} - ${status}`}
            aria-label={`${fmt(h)} - ${status}`}
            disabled={!admin && s.state !== 'free'}
            className={`slot ${s.state}${selected === h ? ' sel' : ''}`}
            onClick={() => onPick && onPick(h, s)}
          >
            <span>{fmt(h)}</span>
            <small>{status}</small>
          </button>
        );
      })}
    </div>
  );
}
