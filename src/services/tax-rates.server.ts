import type { TaxRate, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getTaxRates(
  page = 0,
  size = 50,
): Promise<PagedResponse<TaxRate>> {
  return serverGet<PagedResponse<TaxRate>>(
    `/tax-rates?page=${page}&size=${size}`,
  );
}
