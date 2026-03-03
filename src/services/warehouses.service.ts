import type { Warehouse } from "@/types";
import { mockDelay } from "./api.config";
import { warehouses, setWarehouses } from "./mock-data/warehouses";

export async function getWarehouses(): Promise<Warehouse[]> {
  await mockDelay();
  return warehouses.map((w) => ({ ...w }));
}

export async function getWarehouseById(
  id: string,
): Promise<Warehouse | null> {
  await mockDelay();
  const wh = warehouses.find((w) => w.id === id);
  return wh ? { ...wh } : null;
}

export async function getWarehousesByStore(
  storeId: string,
): Promise<Warehouse[]> {
  await mockDelay();
  return warehouses
    .filter((w) => w.storeId === storeId)
    .map((w) => ({ ...w }));
}

export async function createWarehouse(
  data: Omit<Warehouse, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">,
): Promise<Warehouse> {
  await mockDelay(300);
  const newWarehouse: Warehouse = {
    ...data,
    id: `wh-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "admin",
    updatedBy: "admin",
  };
  setWarehouses([...warehouses, newWarehouse]);
  return { ...newWarehouse };
}

export async function updateWarehouse(
  id: string,
  data: Partial<Warehouse>,
): Promise<Warehouse | null> {
  await mockDelay(300);
  const idx = warehouses.findIndex((w) => w.id === id);
  if (idx === -1) return null;
  const updated: Warehouse = {
    ...warehouses[idx],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };
  const next = [...warehouses];
  next[idx] = updated;
  setWarehouses(next);
  return { ...updated };
}

export async function deleteWarehouse(id: string): Promise<boolean> {
  await mockDelay(300);
  const idx = warehouses.findIndex((w) => w.id === id);
  if (idx === -1) return false;
  setWarehouses(warehouses.filter((w) => w.id !== id));
  return true;
}
