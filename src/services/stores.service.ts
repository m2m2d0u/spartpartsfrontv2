import type { Store } from "@/types";
import { mockDelay } from "./api.config";
import { stores, setStores } from "./mock-data/stores";

export async function getStores(): Promise<Store[]> {
  await mockDelay();
  return stores.map((s) => ({ ...s }));
}

export async function getStoreById(id: string): Promise<Store | null> {
  await mockDelay();
  const store = stores.find((s) => s.id === id);
  return store ? { ...store } : null;
}

export async function createStore(
  data: Omit<Store, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "warehouseCount">,
): Promise<Store> {
  await mockDelay(300);
  const newStore: Store = {
    ...data,
    id: `store-${Date.now()}`,
    warehouseCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "admin",
    updatedBy: "admin",
  };
  setStores([...stores, newStore]);
  return { ...newStore };
}

export async function updateStore(
  id: string,
  data: Partial<Store>,
): Promise<Store | null> {
  await mockDelay(300);
  const idx = stores.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const updated: Store = {
    ...stores[idx],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };
  const next = [...stores];
  next[idx] = updated;
  setStores(next);
  return { ...updated };
}

export async function deleteStore(id: string): Promise<boolean> {
  await mockDelay(300);
  const idx = stores.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  setStores(stores.filter((s) => s.id !== id));
  return true;
}
