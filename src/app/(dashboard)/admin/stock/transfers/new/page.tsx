import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { StockTransferForm } from "../_components/stock-transfer-form";

export const metadata: Metadata = {
  title: "New Stock Transfer",
};

export default async function NewStockTransferPage() {
  const t = await getTranslations("stockTransfers");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newTransfer")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stock") },
          { label: tNav("stockTransfers"), href: "/admin/stock/transfers" },
          { label: t("newTransfer") },
        ]}
      />

      <StockTransferForm />
    </>
  );
}
