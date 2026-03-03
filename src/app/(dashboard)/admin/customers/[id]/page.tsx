import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomerById } from "@/services/customers.server";

export const metadata: Metadata = {
  title: "Customer Detail",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) notFound();

  const fullAddress = [
    customer.street,
    customer.city,
    customer.state,
    customer.postalCode,
    customer.country,
  ]
    .filter(Boolean)
    .join(", ");

  const t = await getTranslations("customers");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={customer.name}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("customers"), href: "/admin/customers" },
          { label: customer.name },
        ]}
        actions={
          <Link
            href={`/admin/customers/${customer.id}/edit`}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            {t("editCustomer")}
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main info */}
        <div className="xl:col-span-2">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {t("customerInformation")}
              </h3>
              <StatusBadge
                variant={customer.portalAccess ? "success" : "neutral"}
              >
                {customer.portalAccess ? t("portalEnabled") : t("portalDisabled")}
              </StatusBadge>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-body-sm text-dark-6">{t("name")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {customer.name}
                </dd>
              </div>
              {customer.company && (
                <div>
                  <dt className="text-body-sm text-dark-6">{t("company")}</dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {customer.company}
                  </dd>
                </div>
              )}
              {customer.email && (
                <div>
                  <dt className="text-body-sm text-dark-6">
                    {tCommon("email")}
                  </dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {customer.email}
                  </dd>
                </div>
              )}
              {customer.phone && (
                <div>
                  <dt className="text-body-sm text-dark-6">
                    {tCommon("phone")}
                  </dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {customer.phone}
                  </dd>
                </div>
              )}
              {customer.taxId && (
                <div>
                  <dt className="text-body-sm text-dark-6">{t("taxId")}</dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {customer.taxId}
                  </dd>
                </div>
              )}
              {fullAddress && (
                <div className="sm:col-span-2">
                  <dt className="text-body-sm text-dark-6">
                    {tCommon("address")}
                  </dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {fullAddress}
                  </dd>
                </div>
              )}
            </dl>

            {customer.notes && (
              <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
                <dt className="text-body-sm text-dark-6">{t("notes")}</dt>
                <dd className="mt-1 text-sm text-dark dark:text-white">
                  {customer.notes}
                </dd>
              </div>
            )}
          </div>
        </div>

        {/* Summary sidebar */}
        <div>
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {t("summary")}
            </h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">
                  {t("totalOrders")}
                </dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">
                  {t("totalInvoices")}
                </dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">
                  {t("totalSpent")}
                </dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
