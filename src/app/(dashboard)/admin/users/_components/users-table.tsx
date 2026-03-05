"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getUserStatusVariant, getUserRoleVariant } from "@/lib/status-variants";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { User } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  users: User[];
  totalElements: number;
  initialPage: number;
};

export function UsersTable({ users: initialUsers, totalElements: initialTotal, initialPage }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const t = useTranslations("users");

  const fetchPage = useCallback(async (page: number) => {
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{ content: User[]; totalElements: number }>(
      `/users?page=${page - 1}&size=${PAGE_SIZE}`,
    );
    setUsers(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

  const roleOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const u of initialUsers) {
      if (u.roleCode && !map.has(u.roleCode)) {
        map.set(u.roleCode, u.roleDisplayName || u.roleCode);
      }
    }
    return [...map.entries()].map(([value, label]) => ({ value, label }));
  }, [initialUsers]);
  const tCommon = useTranslations("common");

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.roleCode === roleFilter;
    return matchesSearch && matchesRole;
  });

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteUser } = await import("@/services/users.service");
    await deleteUser(deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
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
      render: (row) =>
        row.roleCode ? (
          <StatusBadge variant={getUserRoleVariant(row.roleCode)}>
            {row.roleDisplayName || row.roleCode}
          </StatusBadge>
        ) : (
          <span className="text-body-sm text-dark-6">—</span>
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
          <PermissionGate permission={Permission.USER_UPDATE}>
            <Link
              href={`/admin/users/${row.id}/edit`}
              className="text-body-sm text-primary hover:underline"
            >
              {tCommon("edit")}
            </Link>
          </PermissionGate>
          <PermissionGate permission={Permission.USER_DELETE}>
            {row.isActive && (
              <button
                type="button"
                onClick={() => setDeleteId(row.id)}
                className="text-body-sm text-red hover:underline"
              >
                {t("deactivate")}
              </button>
            )}
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
        searchPlaceholder={t("searchUsers")}
        filterSlot={
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">{t("allRoles")}</option>
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        }
        rowKey={(row) => row.id}
        emptyMessage={t("noUsers")}
        emptyDescription={t("noUsersDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
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
