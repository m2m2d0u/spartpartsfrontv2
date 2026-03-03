import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWarehouseStatusVariant } from "@/lib/status-variants";
import { getWarehouseById } from "@/services/warehouses.service";

export const metadata: Metadata = {
  title: "Warehouse Detail",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WarehouseDetailPage({ params }: Props) {
  const { id } = await params;
  const warehouse = await getWarehouseById(id);

  if (!warehouse) notFound();

  return (
    <>
      <PageHeader
        title={warehouse.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Warehouses", href: "/admin/warehouses" },
          { label: warehouse.name },
        ]}
        actions={
          <Link
            href={`/admin/warehouses/${warehouse.id}/edit`}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Edit Warehouse
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main info */}
        <div className="xl:col-span-2">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Warehouse Information
              </h3>
              <StatusBadge
                variant={getWarehouseStatusVariant(warehouse.isActive)}
              >
                {warehouse.isActive ? "Active" : "Inactive"}
              </StatusBadge>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-body-sm text-dark-6">Code</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouse.code}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Store</dt>
                <dd className="font-medium text-dark dark:text-white">
                  <Link
                    href={`/admin/stores/${warehouse.storeId}`}
                    className="text-primary hover:underline"
                  >
                    {warehouse.storeName}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">City</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouse.city}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Phone</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouse.phone}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-body-sm text-dark-6">Address</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouse.address}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Contact Person</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouse.contactPerson}
                </dd>
              </div>
            </dl>

            {warehouse.notes && (
              <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
                <dt className="text-body-sm text-dark-6">Notes</dt>
                <dd className="mt-1 text-sm text-dark dark:text-white">
                  {warehouse.notes}
                </dd>
              </div>
            )}
          </div>
        </div>

        {/* Stock summary placeholder */}
        <div>
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Stock Summary
            </h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">Total Parts</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">Low Stock Items</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">Stock Value</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
