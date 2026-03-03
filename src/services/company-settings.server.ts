import type { CompanySettings } from "@/types";
import { serverGet } from "./server-api";

export async function getCompanySettings(): Promise<CompanySettings> {
  return serverGet<CompanySettings>("/settings");
}
