import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getSupplierById } from "@/services/suppliers.server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("suppliers");
  return { title: t("title") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SupplierDetailPage({ params }: Props) {
  const { id } = await params;
  const supplier = await getSupplierById(id).catch(() => null);

  if (!supplier) notFound();

  const fullAddress = [
    supplier.street,
    supplier.city,
    supplier.state,
    supplier.postalCode,
    supplier.country,
  ]
    .filter(Boolean)
    .join(", ");

  const t = await getTranslations("suppliers");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={supplier.name}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("procurement") },
          { label: tNav("suppliers"), href: "/admin/suppliers" },
          { label: supplier.name },
        ]}
        actions={
          <PermissionGate permission={Permission.PROCUREMENT_UPDATE}>
            <Link
              href={`/admin/suppliers/${supplier.id}/edit`}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {tCommon("edit")}
            </Link>
          </PermissionGate>
        }
      />

      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          {t("supplierInformation")}
        </h3>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-body-sm text-dark-6">{t("name")}</dt>
            <dd className="font-medium text-dark dark:text-white">
              {supplier.name}
            </dd>
          </div>
          {supplier.contactPerson && (
            <div>
              <dt className="text-body-sm text-dark-6">
                {t("contactPerson")}
              </dt>
              <dd className="font-medium text-dark dark:text-white">
                {supplier.contactPerson}
              </dd>
            </div>
          )}
          {supplier.email && (
            <div>
              <dt className="text-body-sm text-dark-6">{tCommon("email")}</dt>
              <dd className="font-medium text-dark dark:text-white">
                {supplier.email}
              </dd>
            </div>
          )}
          {supplier.phone && (
            <div>
              <dt className="text-body-sm text-dark-6">{tCommon("phone")}</dt>
              <dd className="font-medium text-dark dark:text-white">
                {supplier.phone}
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

        {supplier.notes && (
          <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
            <dt className="text-body-sm text-dark-6">{t("notes")}</dt>
            <dd className="mt-1 text-sm text-dark dark:text-white">
              {supplier.notes}
            </dd>
          </div>
        )}
      </div>
    </>
  );
}
