import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStoreStatusVariant } from "@/lib/status-variants";
import { getStoreById } from "@/services/stores.server";
import { getWarehousesByStore } from "@/services/warehouses.server";

export const metadata: Metadata = {
  title: "Store Detail",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoreDetailPage({ params }: Props) {
  const { id } = await params;
  const [store, warehousesPage] = await Promise.all([
    getStoreById(id),
    getWarehousesByStore(id),
  ]);

  if (!store) notFound();

  const warehouses = warehousesPage.content;

  return (
    <>
      <PageHeader
        title={store.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Stores", href: "/admin/stores" },
          { label: store.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/stores/${store.id}/settings`}
              className="rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              Store Settings
            </Link>
            <Link
              href={`/admin/stores/${store.id}/edit`}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              Edit Store
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Store Info */}
        <div className="xl:col-span-2">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Store Information
              </h3>
              <StatusBadge variant={getStoreStatusVariant(store.isActive)}>
                {store.isActive ? "Active" : "Inactive"}
              </StatusBadge>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-body-sm text-dark-6">Code</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.code}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Email</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.email}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Phone</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.phone}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">City</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.city}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-body-sm text-dark-6">Address</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.street}, {store.city},{" "}
                  {store.state} {store.postalCode},{" "}
                  {store.country}
                </dd>
              </div>
            </dl>

            {/* Override indicators */}
            {(store.ninea || store.rccm || store.taxId) && (
              <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
                <h4 className="mb-3 text-body-sm font-medium text-dark dark:text-white">
                  Custom Overrides
                </h4>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {store.ninea && (
                    <div>
                      <dt className="text-body-sm text-dark-6">NINEA</dt>
                      <dd className="text-sm text-dark dark:text-white">
                        {store.ninea}
                      </dd>
                    </div>
                  )}
                  {store.rccm && (
                    <div>
                      <dt className="text-body-sm text-dark-6">RCCM</dt>
                      <dd className="text-sm text-dark dark:text-white">
                        {store.rccm}
                      </dd>
                    </div>
                  )}
                  {store.taxId && (
                    <div>
                      <dt className="text-body-sm text-dark-6">Tax ID</dt>
                      <dd className="text-sm text-dark dark:text-white">
                        {store.taxId}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-6">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Summary
            </h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">Warehouses</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouses.length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">Total Customers</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">Monthly Revenue</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
            </dl>
          </div>

          {/* Warehouses list */}
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Warehouses
              </h3>
              <Link
                href={`/admin/warehouses/new?storeId=${store.id}`}
                className="text-body-sm text-primary hover:underline"
              >
                Add
              </Link>
            </div>
            {warehouses.length === 0 ? (
              <p className="text-body-sm text-dark-6">
                No warehouses assigned yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {warehouses.map((wh) => (
                  <li key={wh.id}>
                    <Link
                      href={`/admin/warehouses/${wh.id}`}
                      className="flex items-center justify-between rounded-lg border border-stroke px-4 py-3 transition hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {wh.name}
                        </p>
                        <p className="text-xs text-dark-6">
                          {wh.code} — {wh.city}
                        </p>
                      </div>
                      <StatusBadge
                        variant={wh.isActive ? "success" : "neutral"}
                      >
                        {wh.isActive ? "Active" : "Inactive"}
                      </StatusBadge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
