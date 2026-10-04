'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '../../../lib/store';
import LocationMap from '../../../components/LocationMap';

const CONTACT = '+94 77 123 4567';

export default function FacilityDetails() {
  const { id } = useParams();
  const { db, ready } = useStore();
  const facility = db.facilities.find((item) => item.id === id && !item.deleted);

  if (!ready) return <p role="status">Loading facility details...</p>;
  if (!facility) return <section className="card"><h1>Facility not found</h1><Link href="/">Back to availability</Link></section>;

  return (
    <>
      <Link className="back-link" href="/">← Back to availability</Link>
      <p className="eyebrow">JAFFNA SPORTS ACADEMY · JAFFNA</p>
      <h1>{facility.name}</h1>
      <p className="muted">{facility.sport} · {facility.ground === 'Independent' ? 'Independent court' : 'Shared ground'}</p>
      <section className="detail-layout">
        <div>
          <h2>Facility information</h2>
          <p className="rate">LKR {facility.rate.toLocaleString()} <span>/ hour</span></p>
          <h3>Amenities</h3>
          <ul className="amenity-list">{(facility.amenities || []).map((amenity) => <li key={amenity}>{amenity}</li>)}</ul>
          {facility.ground !== 'Independent' && <p className="warn">Shared ground restriction: Cricket and Football cannot be booked for the same time slot. Availability reflects the latest schedule.</p>}
          <div className="contact-actions">
            <a className="btn" href={`tel:${CONTACT.replace(/[\s]/g, '')}`}>Call {CONTACT}</a>
            <a className="contact-link" href={`https://wa.me/${CONTACT.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp JSA</a>
          </div>
        </div>
        <div className="map-frame">
          <LocationMap />
          <p>Jaffna Sports Academy, Jaffna</p>
        </div>
      </section>
    </>
  );
}