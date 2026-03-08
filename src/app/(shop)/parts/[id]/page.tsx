import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopPartById, getShopStoreConfig } from "@/services/shop.server";
import { PartDetailView } from "@/components/shop/part-detail-view";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const part = await getShopPartById(id);
    return {
      title: `${part.name} | Spare Parts Store`,
      description: part.shortDescription || part.name,
    };
  } catch {
    return { title: "Part Not Found" };
  }
}

export default async function PartDetailPage({ params }: Props) {
  const { id } = await params;

  let part;
  let storeConfig;

  try {
    [part, storeConfig] = await Promise.all([
      getShopPartById(id),
      getShopStoreConfig(),
    ]);
  } catch {
    notFound();
  }

  const currencyOptions = storeConfig
    ? {
        symbol: storeConfig.currencySymbol,
        position: storeConfig.currencyPosition,
        decimals: storeConfig.currencyDecimals,
        thousandsSeparator: storeConfig.thousandsSeparator,
      }
    : undefined;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-dark-5 dark:text-dark-6">
        <Link href="/" className="transition hover:text-primary">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-dark dark:text-white">{part.name}</span>
      </nav>

      <PartDetailView part={part} currencyOptions={currencyOptions} />
    </div>
  );
}
