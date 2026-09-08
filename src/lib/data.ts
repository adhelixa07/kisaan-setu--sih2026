// Sample marketplace data. Trust sub-scores are stored per farmer (0-100 each)
// and the weighted total is computed once here, mirroring a server-side
// trustScoreService rather than being recalculated ad hoc in the UI.

export const TRUST_WEIGHTS = {
  reviews: 0.05,
  identity: 0.25,
  farm: 0.2,
  fpo: 0.15,
  transactions: 0.15,
  consistency: 0.1,
  location: 0.1,
} as const;

export type TrustComponents = Record<keyof typeof TRUST_WEIGHTS, number>;

export const trustTotal = (c: TrustComponents) =>
  Math.round(
    (Object.keys(TRUST_WEIGHTS) as Array<keyof TrustComponents>).reduce(
      (sum, key) => sum + c[key] * TRUST_WEIGHTS[key],
      0,
    ),
  );

export type Farmer = {
  id: string;
  name: string;
  village: string;
  district: string;
  verified: boolean;
  trust: TrustComponents;
};

export const farmers: Farmer[] = [
  {
    id: "f1",
    name: "Ramesh Yadav",
    village: "Barhi",
    district: "Hazaribagh, Jharkhand",
    verified: true,
    trust: {
      reviews: 92,
      identity: 100,
      farm: 95,
      fpo: 88,
      transactions: 90,
      consistency: 85,
      location: 96,
    },
  },
  {
    id: "f2",
    name: "Sunita Devi",
    village: "Nanpara",
    district: "Bahraich, Uttar Pradesh",
    verified: true,
    trust: {
      reviews: 88,
      identity: 100,
      farm: 90,
      fpo: 70,
      transactions: 82,
      consistency: 90,
      location: 92,
    },
  },
  {
    id: "f3",
    name: "Anil Mahato",
    village: "Bishnupur",
    district: "Bankura, West Bengal",
    verified: true,
    trust: {
      reviews: 74,
      identity: 100,
      farm: 80,
      fpo: 40,
      transactions: 68,
      consistency: 72,
      location: 85,
    },
  },
  {
    id: "f4",
    name: "Kavita Patil",
    village: "Shirur",
    district: "Pune, Maharashtra",
    verified: false,
    trust: {
      reviews: 60,
      identity: 55,
      farm: 40,
      fpo: 0,
      transactions: 45,
      consistency: 58,
      location: 70,
    },
  },
  {
    id: "f5",
    name: "Gurpreet Singh",
    village: "Dhuri",
    district: "Sangrur, Punjab",
    verified: true,
    trust: {
      reviews: 96,
      identity: 100,
      farm: 98,
      fpo: 95,
      transactions: 94,
      consistency: 92,
      location: 98,
    },
  },
];

export const farmerById = (id: string) => farmers.find((f) => f.id === id);

export type Unit = "quintal" | "kg" | "ton";
export type Grade = "a" | "b" | "c";
export type ListingStatus = "active" | "negotiation" | "sold" | "expired";

export type Listing = {
  id: string;
  crop: string;
  farmerId: string;
  quantity: number;
  unit: Unit;
  grade: Grade;
  harvestDate: string;
  price: number;
  status: ListingStatus;
  ownListing?: boolean;
  photo?: string;
};

export const CROPS = [
  "Wheat",
  "Paddy (Rice)",
  "Maize",
  "Mustard",
  "Potato",
  "Onion",
  "Tomato",
  "Turmeric",
  "Gram (Chana)",
  "Sugarcane",
];

export const sampleListings: Listing[] = [
  { id: "l1", crop: "Wheat", farmerId: "f5", quantity: 180, unit: "quintal", grade: "a", harvestDate: "2026-08-21", price: 2450, status: "active" },
  { id: "l2", crop: "Paddy (Rice)", farmerId: "f1", quantity: 240, unit: "quintal", grade: "b", harvestDate: "2026-08-30", price: 2100, status: "active", ownListing: true },
  { id: "l3", crop: "Potato", farmerId: "f3", quantity: 95, unit: "quintal", grade: "b", harvestDate: "2026-09-01", price: 1180, status: "active" },
  { id: "l4", crop: "Onion", farmerId: "f2", quantity: 130, unit: "quintal", grade: "a", harvestDate: "2026-08-27", price: 1650, status: "active" },
  { id: "l5", crop: "Turmeric", farmerId: "f4", quantity: 40, unit: "quintal", grade: "c", harvestDate: "2026-07-18", price: 7400, status: "active" },
  { id: "l6", crop: "Maize", farmerId: "f1", quantity: 310, unit: "quintal", grade: "b", harvestDate: "2026-08-12", price: 1980, status: "negotiation", ownListing: true },
  { id: "l7", crop: "Mustard", farmerId: "f5", quantity: 70, unit: "quintal", grade: "a", harvestDate: "2026-08-05", price: 5350, status: "active" },
  { id: "l8", crop: "Tomato", farmerId: "f2", quantity: 55, unit: "quintal", grade: "b", harvestDate: "2026-09-03", price: 1420, status: "active" },
  { id: "l9", crop: "Gram (Chana)", farmerId: "f3", quantity: 120, unit: "quintal", grade: "a", harvestDate: "2026-07-29", price: 6100, status: "active" },
  { id: "l10", crop: "Sugarcane", farmerId: "f4", quantity: 8, unit: "ton", grade: "b", harvestDate: "2026-08-16", price: 3150, status: "active" },
  { id: "l11", crop: "Wheat", farmerId: "f1", quantity: 60, unit: "quintal", grade: "b", harvestDate: "2026-06-22", price: 2280, status: "sold", ownListing: true },
  { id: "l12", crop: "Potato", farmerId: "f1", quantity: 45, unit: "quintal", grade: "c", harvestDate: "2026-05-30", price: 1050, status: "expired", ownListing: true },
];

export type Order = {
  id: string;
  listingId: string;
  crop: string;
  farmerName: string;
  quantity: number;
  unit: Unit;
  pricePerUnit: number;
  total: number;
  status: "paid" | "completed";
  placedAt: string;
};

export const sampleOrders: Order[] = [
  {
    id: "KS-2026-0418",
    listingId: "l7",
    crop: "Mustard",
    farmerName: "Gurpreet Singh",
    quantity: 20,
    unit: "quintal",
    pricePerUnit: 5350,
    total: 107000,
    status: "completed",
    placedAt: "2026-08-19",
  },
  {
    id: "KS-2026-0431",
    listingId: "l4",
    crop: "Onion",
    farmerName: "Sunita Devi",
    quantity: 35,
    unit: "quintal",
    pricePerUnit: 1650,
    total: 57750,
    status: "paid",
    placedAt: "2026-09-02",
  },
];

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
