import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPartById } from "@/services/parts.server";

export const metadata: Metadata = {
  title: "Part Detail",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PartDetailPage({ params }: Props) {
  const { id } = await params;
  const part = await getPartById(id);

  if (!part) notFound();

  return (
    <>
      <PageHeader
        title={part.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Parts", href: "/admin/parts" },
          { label: part.name },
        ]}
        actions={
          <Link
            href={`/admin/parts/${part.id}/edit`}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Edit Part
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Part Info */}
        <div className="xl:col-span-2">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Part Information
              </h3>
              <StatusBadge variant={part.published ? "success" : "neutral"}>
                {part.published ? "Published" : "Draft"}
              </StatusBadge>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-body-sm text-dark-6">Part Number</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.partNumber}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Category</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.categoryName || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Selling Price</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.sellingPrice.toLocaleString("fr-FR")} FCFA
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Purchase Price</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.purchasePrice.toLocaleString("fr-FR")} FCFA
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Min Stock Level</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.minStockLevel}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">Created</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {new Date(part.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
              {part.shortDescription && (
                <div className="sm:col-span-2">
                  <dt className="text-body-sm text-dark-6">
                    Short Description
                  </dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {part.shortDescription}
                  </dd>
                </div>
              )}
              {part.description && (
                <div className="sm:col-span-2">
                  <dt className="text-body-sm text-dark-6">Description</dt>
                  <dd className="whitespace-pre-wrap text-sm text-dark dark:text-white">
                    {part.description}
                  </dd>
                </div>
              )}
            </dl>

            {part.notes && (
              <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
                <h4 className="mb-3 text-body-sm font-medium text-dark dark:text-white">
                  Internal Notes
                </h4>
                <p className="whitespace-pre-wrap text-sm text-dark-6">
                  {part.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Pricing
            </h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">Selling Price</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.sellingPrice.toLocaleString("fr-FR")} FCFA
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">Purchase Price</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.purchasePrice.toLocaleString("fr-FR")} FCFA
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-stroke pt-3 dark:border-dark-3">
                <dt className="text-body-sm font-medium text-dark dark:text-white">
                  Margin
                </dt>
                <dd className="font-medium text-green-light-1">
                  {(part.sellingPrice - part.purchasePrice).toLocaleString(
                    "fr-FR",
                  )}{" "}
                  FCFA
                </dd>
              </div>
            </dl>
          </div>

          {/* Images */}
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Images
            </h3>
            {part.images && part.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {part.images.map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square overflow-hidden rounded-lg border border-stroke dark:border-dark-3"
                  >
                    <img
                      src={img.url}
                      alt={part.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-dark-6">No images uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
