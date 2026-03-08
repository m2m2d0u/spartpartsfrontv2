import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
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

  const t = await getTranslations("parts");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={part.name}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: part.name },
        ]}
        actions={
          <Link
            href={`/admin/parts/${part.id}/edit`}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            {t("editPart")}
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Part Info */}
        <div className="xl:col-span-2">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {t("partInfo")}
              </h3>
              <StatusBadge variant={part.published ? "success" : "neutral"}>
                {part.published ? tCommon("published") : tCommon("draft")}
              </StatusBadge>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-body-sm text-dark-6">{t("partNumber")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.partNumber}
                </dd>
              </div>
              {part.reference && (
                <div>
                  <dt className="text-body-sm text-dark-6">{t("reference")}</dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {part.reference}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-body-sm text-dark-6">{t("category")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.categoryName || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("carBrand")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.carBrandName || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("carModel")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.carModelName || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("sellingPrice")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.sellingPrice.toLocaleString("fr-FR")} FCFA
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("purchasePrice")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.purchasePrice.toLocaleString("fr-FR")} FCFA
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("minStockLevel")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.minStockLevel}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("created")}</dt>
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
                    {t("shortDescription")}
                  </dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {part.shortDescription}
                  </dd>
                </div>
              )}
              {part.description && (
                <div className="sm:col-span-2">
                  <dt className="text-body-sm text-dark-6">{t("description")}</dt>
                  <dd className="whitespace-pre-wrap text-sm text-dark dark:text-white">
                    {part.description}
                  </dd>
                </div>
              )}
            </dl>

            {part.tags && part.tags.length > 0 && (
              <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
                <h4 className="mb-3 text-body-sm font-medium text-dark dark:text-white">
                  {t("tagsLabel")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {part.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-primary bg-primary/10 px-3 py-1 text-body-sm text-primary dark:bg-primary/20"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {part.notes && (
              <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
                <h4 className="mb-3 text-body-sm font-medium text-dark dark:text-white">
                  {t("internalNotes")}
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
              {t("pricing")}
            </h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">{t("sellingPrice")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.sellingPrice.toLocaleString("fr-FR")} FCFA
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">{t("purchasePrice")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {part.purchasePrice.toLocaleString("fr-FR")} FCFA
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-stroke pt-3 dark:border-dark-3">
                <dt className="text-body-sm font-medium text-dark dark:text-white">
                  {t("margin")}
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
              {t("images")}
            </h3>
            {part.images && part.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {part.images.map((img) => (
                  <div
                    key={img.id}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 ${img.isMain ? "border-primary" : "border-stroke dark:border-dark-3"}`}
                  >
                    <img
                      src={img.url}
                      alt={part.name}
                      className="h-full w-full object-cover"
                    />
                    {img.isMain && (
                      <div className="absolute left-1.5 top-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-body-xs font-medium text-white">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                          </svg>
                          {t("mainImage")}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-dark-6">{t("noImages")}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
