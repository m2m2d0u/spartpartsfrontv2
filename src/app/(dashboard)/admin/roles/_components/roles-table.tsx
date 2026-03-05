"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getRoleStatusVariant, getRoleTypeVariant } from "@/lib/status-variants";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { Role } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  roles: Role[];
  totalElements: number;
  initialPage: number;
};

type TypeFilter = "" | "system" | "custom";

export function RolesTable({ roles: initialRoles, totalElements: initialTotal, initialPage }: Props) {
  const [roles, setRoles] = useState(initialRoles);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("");
  const t = useTranslations("roles");
  const tCommon = useTranslations("common");

  const fetchPage = useCallback(async (page: number) => {
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{ content: Role[]; totalElements: number }>(
      `/roles?page=${page - 1}&size=${PAGE_SIZE}`,
    );
    setRoles(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

  function translateRole(role: Role) {
    return role.displayName;
  }

  const filtered = roles.filter((r) => {
    const matchesSearch =
      r.displayName.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      !typeFilter ||
      (typeFilter === "system" && r.isSystem) ||
      (typeFilter === "custom" && !r.isSystem);
    return matchesSearch && matchesType;
  });

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { deleteRole } = await import("@/services/roles.service");
      await deleteRole(deleteId);
    } catch {
      // error handled silently
    }
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
  }

  const columns: Column<Role>[] = [
    {
      key: "displayName",
      header: t("roleName"),
      render: (row) => (
        <Link
          href={`/admin/roles/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {translateRole(row)}
        </Link>
      ),
    },
    {
      key: "code",
      header: t("roleCode"),
      render: (row) => (
        <span className="font-mono text-body-sm text-dark-6">{row.code}</span>
      ),
    },
    {
      key: "type",
      header: t("type"),
      render: (row) => (
        <StatusBadge variant={getRoleTypeVariant(row.isSystem)}>
          {row.isSystem ? t("system") : t("custom")}
        </StatusBadge>
      ),
    },
    {
      key: "roleLevel",
      header: t("roleLevel"),
      render: (row) => (
        <StatusBadge variant={row.roleLevel === "SYSTEM" ? "info" : row.roleLevel === "STORE" ? "success" : "warning"}>
          {t(`roleLevel_${row.roleLevel}`)}
        </StatusBadge>
      ),
    },
    {
      key: "permissionCount",
      header: t("permissionCount"),
      render: (row) => (
        <span className="text-body-sm text-dark-6">{row.permissionCount}</span>
      ),
    },
    {
      key: "status",
      header: tCommon("status"),
      render: (row) => (
        <StatusBadge variant={getRoleStatusVariant(row.isActive)}>
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
            href={`/admin/roles/${row.id}`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("view")}
          </Link>
          <PermissionGate permission={Permission.ROLE_UPDATE}>
            <Link
              href={`/admin/roles/${row.id}/edit`}
              className="text-body-sm text-primary hover:underline"
            >
              {tCommon("edit")}
            </Link>
          </PermissionGate>
          <PermissionGate permission={Permission.ROLE_DELETE}>
            {!row.isSystem && (
              <button
                type="button"
                onClick={() => setDeleteId(row.id)}
                className="text-body-sm text-red hover:underline"
              >
                {t("deleteRole")}
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
        searchPlaceholder={t("searchRoles")}
        filterSlot={
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">{t("allTypes")}</option>
            <option value="system">{t("system")}</option>
            <option value="custom">{t("custom")}</option>
          </select>
        }
        rowKey={(row) => row.id}
        emptyMessage={t("noRoles")}
        emptyDescription={t("noRolesDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteRoleTitle")}
        description={t("deleteRoleDescription")}
        confirmLabel={t("deleteRole")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
