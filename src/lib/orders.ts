export interface LocalOrder {
  _id: string;
  invoice: string;
  total: number;
  createdAt?: string;
  items: { name: string; qty: number; price: number }[];
  payment?: string;
  shipping?: string;
}

const STORAGE_KEY = "ocil-fragrance-orders";

export function getLocalOrders(): LocalOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? (parsed as LocalOrder[]) : [];
  } catch {
    return [];
  }
}

export function addLocalOrder(order: LocalOrder): void {
  if (typeof window === "undefined") return;

  try {
    const list = getLocalOrders().filter((item) => item._id !== order._id);

    list.unshift(order);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

export function removeLocalOrder(_id: string): void {
  if (typeof window === "undefined") return;

  try {
    const list = getLocalOrders().filter((item) => item._id !== _id);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function clearLocalOrders(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
