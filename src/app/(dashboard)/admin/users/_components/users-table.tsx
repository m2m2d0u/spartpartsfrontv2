"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getUserStatusVariant, getUserRoleVariant } from "@/lib/status-variants";
import type { User, UserRole } from "@/types";

type Props = {
  users: User[];
};

const ROLES: UserRole[] = ["ADMIN", "STORE_MANAGER", "WAREHOUSE_OPERATOR"];

export function UsersTable({ users: initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const t = useTranslations("users");
  const tCommon = useTranslations("common");

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteUser } = await import("@/services/users.service");
    await deleteUser(deleteId);
    setUsers((prev) =>
      prev.map((u) => (u.id === deleteId ? { ...u, isActive: false } : u)),
    );
    setDeleteId(null);
    setDeleting(false);
  }

  const columns: Column<User>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={`/admin/users/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "email",
      header: t("email"),
      render: (row) => (
        <span className="text-body-sm text-dark-6">{row.email}</span>
      ),
    },
    {
      key: "role",
      header: t("role"),
      render: (row) => (
        <StatusBadge variant={getUserRoleVariant(row.role)}>
          {t(`role_${row.role}`)}
        </StatusBadge>
      ),
    },
    {
      key: "status",
      header: tCommon("status"),
      render: (row) => (
        <StatusBadge variant={getUserStatusVariant(row.isActive)}>
          {row.isActive ? tCommon("active") : tCommon("inactive")}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/users/${row.id}`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("view")}
          </Link>
          <Link
            href={`/admin/users/${row.id}/edit`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("edit")}
          </Link>
          {row.isActive && (
            <button
              type="button"
              onClick={() => setDeleteId(row.id)}
              className="text-body-sm text-red hover:underline"
            >
              {t("deactivate")}
            </button>
          )}
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
        searchPlaceholder={t("searchUsers")}
        filterSlot={
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">{t("allRoles")}</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`role_${r}`)}
              </option>
            ))}
          </select>
        }
        rowKey={(row) => row.id}
        emptyMessage={t("noUsers")}
        emptyDescription={t("noUsersDescription")}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deactivateUserTitle")}
        description={t("deactivateUserDescription")}
        confirmLabel={t("deactivate")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
