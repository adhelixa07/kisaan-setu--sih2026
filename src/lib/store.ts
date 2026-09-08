import { useEffect, useState } from "react";
import { sampleListings, sampleOrders, type Listing, type Order } from "./data";

export const ROLE_KEY = "ks_role";
const LISTINGS_KEY = "ks_listings";
const ORDERS_KEY = "ks_orders";
const CHANGE_EVENT = "ks_store_change";

export type Role = "buyer" | "seller";

const read = <T,>(key: string, fallback: T): T => {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

/** Reads a persisted collection, seeding it with demo data on first use. */
function usePersisted<T>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(seed);

  useEffect(() => {
    const sync = () => setItems(read<T[]>(key, seed));
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return items;
}

export const useListings = () => usePersisted<Listing>(LISTINGS_KEY, sampleListings);
export const useOrders = () => usePersisted<Order>(ORDERS_KEY, sampleOrders);

export const addListing = (listing: Listing) => {
  const current = read<Listing[]>(LISTINGS_KEY, sampleListings);
  write(LISTINGS_KEY, [listing, ...current]);
};

export const addOrder = (order: Order) => {
  const current = read<Order[]>(ORDERS_KEY, sampleOrders);
  write(ORDERS_KEY, [order, ...current]);
};

export const getRole = (): Role | null =>
  typeof localStorage === "undefined" ? null : (localStorage.getItem(ROLE_KEY) as Role | null);

export const setRole = (role: Role) => {
  localStorage.setItem(ROLE_KEY, role);
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

/** True only after hydration, so browser-only reads never mismatch SSR markup. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
