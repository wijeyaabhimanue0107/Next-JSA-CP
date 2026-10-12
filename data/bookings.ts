export type BookingStatus = "Pending" | "Confirmed" | "Rejected";
export type BookingKind = "Booking" | "Maintenance";

export interface Booking {
  ref: string;
  facilityId: number;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  mobile: string;
  email?: string;
  note?: string;
  status: BookingStatus;
  kind?: BookingKind;
  reason?: string;
}

export const bookings: Booking[] = [
  {
    ref: "JSA-8917",
    facilityId: 1,
    date: "2026-10-09",
    startTime: "06:00",
    endTime: "08:00",
    name: "hcdgjcfjg",
    mobile: "+94 77 123 4567",
    email: "wijeyaabhimanue@gmail.com",
    note: "Morning practice",
    status: "Pending",
  },
  {
    ref: "JSA-8916",
    facilityId: 6,
    date: "2026-10-09",
    startTime: "10:00",
    endTime: "12:00",
    name: "Jaffna United",
    mobile: "+94 77 555 1212",
    status: "Confirmed",
  },
];
