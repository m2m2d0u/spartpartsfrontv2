import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getParts } from "@/services/parts.server";
import { PartsTable } from "./_components/parts-table";

export const metadata: Metadata = {
  title: "Parts",
};

async function PartsData() {
  const paged = await getParts();
  return <PartsTable parts={paged.content} />;
}

export default function PartsPage() {
  return (
    <>
      <PageHeader
        title="All Parts"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Parts" },
        ]}
        actions={
          <Link
            href="/admin/parts/new"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Add Part
          </Link>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={6} />}>
        <PartsData />
      </Suspense>
    </>
  );
}
