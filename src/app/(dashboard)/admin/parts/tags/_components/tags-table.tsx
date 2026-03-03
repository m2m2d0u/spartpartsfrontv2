"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Tag } from "@/types";

type Props = {
  tags: Tag[];
};

export function TagsTable({ tags: initialTags }: Props) {
  const [tags, setTags] = useState(initialTags);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("tags");
  const tCommon = useTranslations("common");

  const filtered = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteTag } = await import("@/services/tags.service");
    await deleteTag(deleteId);
    setTags((prev) => prev.filter((tag) => tag.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
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
          <Link
            href={`/admin/parts/tags/${row.id}/edit`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("edit")}
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
            className="text-body-sm text-red hover:underline"
          >
            {tCommon("delete")}
          </button>
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
