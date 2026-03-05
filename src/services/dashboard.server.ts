import "server-only";

import { serverGet } from "./server-api";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboard(): Promise<DashboardData> {
  return serverGet<DashboardData>("/dashboard");
}
