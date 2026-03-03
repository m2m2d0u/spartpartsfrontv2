import type { CompanySettings, UpdateCompanySettingsRequest } from "@/types";
import { apiPut } from "./api-client";

export async function updateCompanySettings(
  data: UpdateCompanySettingsRequest,
): Promise<CompanySettings> {
  return apiPut<CompanySettings>("/settings", data);
}
