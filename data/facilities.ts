export type Sport = "Badminton" | "Cricket" | "Football";
export type Ground = "Independent" | "Shared turf";

export interface Facility {
  id: number;
  name: string;
  sport: Sport;
  ground: Ground;
  ratePerHour: number;
  features: string[];
  location: string;
  whatsapp: string;
  openTime: string;
  closeTime: string;
  isDeleted?: boolean;
}

export const facilities: Facility[] = [
  {
    id: 1,
    name: "Badminton Court 1",
    sport: "Badminton",
    ground: "Independent",
    ratePerHour: 2500,
    features: ["BWF-standard court", "Synthetic rubber mat", "Indoor LED lighting", "Rest area"],
    location: "Jaffna Sports Academy, Jaffna",
    whatsapp: "+94 77 123 4567",
    openTime: "06:00",
    closeTime: "22:00",
  },
  {
    id: 2,
    name: "Cricket Net 1",
    sport: "Cricket",
    ground: "Shared turf",
    ratePerHour: 3000,
    features: ["Practice net", "Shared artificial turf"],
    location: "Jaffna Sports Academy, Jaffna",
    whatsapp: "+94 77 123 4567",
    openTime: "06:00",
    closeTime: "22:00",
  },
  {
    id: 3,
    name: "Cricket Net 2",
    sport: "Cricket",
    ground: "Shared turf",
    ratePerHour: 3000,
    features: ["Practice net", "Shared artificial turf"],
    location: "Jaffna Sports Academy, Jaffna",
    whatsapp: "+94 77 123 4567",
    openTime: "06:00",
    closeTime: "22:00",
  },
  {
    id: 4,
    name: "Cricket Net 3",
    sport: "Cricket",
    ground: "Shared turf",
    ratePerHour: 3000,
    features: ["Practice net", "Shared artificial turf"],
    location: "Jaffna Sports Academy, Jaffna",
    whatsapp: "+94 77 123 4567",
    openTime: "06:00",
    closeTime: "22:00",
  },
  {
    id: 5,
    name: "Cricket Net 4",
    sport: "Cricket",
    ground: "Shared turf",
    ratePerHour: 3000,
    features: ["Practice net", "Shared artificial turf"],
    location: "Jaffna Sports Academy, Jaffna",
    whatsapp: "+94 77 123 4567",
    openTime: "06:00",
    closeTime: "22:00",
  },
  {
    id: 6,
    name: "Football Play Area",
    sport: "Football",
    ground: "Shared turf",
    ratePerHour: 4000,
    features: ["Artificial turf", "Night floodlights", "Changing rooms", "Locker facility"],
    location: "Jaffna Sports Academy, Jaffna",
    whatsapp: "+94 77 123 4567",
    openTime: "06:00",
    closeTime: "22:00",
  },
];
