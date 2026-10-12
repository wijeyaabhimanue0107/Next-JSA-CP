import type { Booking } from "@/data/bookings";
import type { Facility } from "@/data/facilities";
import { overlaps } from "@/lib/time";

const active = (booking: Booking) => booking.status === "Pending" || booking.status === "Confirmed";

export function getConflictMessage(
  facility: Facility,
  date: string,
  range: { start: string; end: string },
  allBookings: Booking[],
) {
  const sameFacility = allBookings.some(
    (booking) =>
      active(booking) &&
      booking.date === date &&
      booking.facilityId === facility.id &&
      overlaps(range, { start: booking.startTime, end: booking.endTime }),
  );
  if (sameFacility) return "Selected time overlaps an existing booking";

  if (facility.sport === "Football") {
    const cricketConflict = allBookings.some(
      (booking) =>
        active(booking) &&
        booking.date === date &&
        booking.facilityId >= 2 &&
        booking.facilityId <= 5 &&
        overlaps(range, { start: booking.startTime, end: booking.endTime }),
    );
    if (cricketConflict) return "Ground In Use (Cricket)";
  }

  if (facility.sport === "Cricket") {
    const footballConflict = allBookings.some(
      (booking) =>
        active(booking) &&
        booking.date === date &&
        booking.facilityId === 6 &&
        overlaps(range, { start: booking.startTime, end: booking.endTime }),
    );
    if (footballConflict) return "Ground In Use (Football)";
  }

  return "";
}
