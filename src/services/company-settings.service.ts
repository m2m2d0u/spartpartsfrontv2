import type { CompanySettings } from "@/types";
import { mockDelay } from "./api.config";
import {
  companySettings,
  setCompanySettings,
} from "./mock-data/company-settings";

export async function getCompanySettings(): Promise<CompanySettings> {
  await mockDelay();
  return { ...companySettings };
}

export async function updateCompanySettings(
  data: Partial<CompanySettings>,
): Promise<CompanySettings> {
  await mockDelay(300);
  const updated: CompanySettings = {
    ...companySettings,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  setCompanySettings(updated);
  return { ...updated };
}
