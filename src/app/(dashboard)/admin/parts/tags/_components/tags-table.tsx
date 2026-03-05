"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { Tag } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  tags: Tag[];
  totalElements: number;
  initialPage: number;
};

export function TagsTable({ tags: initialTags, totalElements: initialTotal, initialPage }: Props) {
  const [tags, setTags] = useState(initialTags);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("tags");
  const tCommon = useTranslations("common");

  const fetchPage = useCallback(async (page: number) => {
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{ content: Tag[]; totalElements: number }>(
      `/tags?page=${page - 1}&size=${PAGE_SIZE}`,
    );
    setTags(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

  const filtered = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteTag } = await import("@/services/tags.service");
    await deleteTag(deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
  }

  const columns: Column<Tag>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={`/admin/parts/tags/${row.id}/edit`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "createdAt",
      header: t("created"),
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <PermissionGate permission={Permission.PART_UPDATE}>
            <Link
              href={`/admin/parts/tags/${row.id}/edit`}
              className="text-body-sm text-primary hover:underline"
            >
              {tCommon("edit")}
            </Link>
          </PermissionGate>
          <PermissionGate permission={Permission.PART_DELETE}>
            <button
              type="button"
              onClick={() => setDeleteId(row.id)}
              className="text-body-sm text-red hover:underline"
            >
              {tCommon("delete")}
            </button>
          </PermissionGate>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={filtered}
        onSearch={setSearch}
        searchPlaceholder={t("searchTags")}
        rowKey={(row) => row.id}
        emptyMessage={t("noTags")}
        emptyDescription={t("noTagsDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteTagTitle")}
        description={t("deleteTagDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
