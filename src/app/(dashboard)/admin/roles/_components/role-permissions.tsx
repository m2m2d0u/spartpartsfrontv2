"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/ui/status-badge";
import { FormSection } from "@/components/FormSection";
import type { PermissionInfo, PermissionCategoryGroup } from "@/types";

type Props = {
  roleId: string;
  assignedPermissions: PermissionInfo[];
  allCategories: PermissionCategoryGroup[];
  isSystemRole: boolean;
};

function getLevelVariant(level: string) {
  switch (level) {
    case "READ":
      return "success";
    case "WRITE":
      return "info";
    case "DELETE":
      return "error";
    case "APPROVE":
      return "warning";
    default:
      return "neutral" as const;
  }
}

export function RolePermissions({
  roleId,
  assignedPermissions,
  allCategories,
  isSystemRole,
}: Props) {
  const assignedIds = new Set(assignedPermissions.map((p) => p.id));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(assignedIds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const t = useTranslations("roles");
  const tCommon = useTranslations("common");
  function translatePerm(perm: PermissionInfo) {
    return perm.displayName;
  }

  function translateCategory(cat: PermissionCategoryGroup) {
    return cat.displayName;
  }

  function translateLevel(perm: PermissionInfo) {
    const key = `level_${perm.level}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : perm.levelDisplayName;
  }

  const hasChanges =
    selectedIds.size !== assignedIds.size ||
    [...selectedIds].some((id) => !assignedIds.has(id));

  function togglePermission(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setSuccess("");
  }

  function toggleCategory(categoryPerms: PermissionInfo[]) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = categoryPerms.every((p) => next.has(p.id));
      if (allSelected) {
        for (const p of categoryPerms) next.delete(p.id);
      } else {
        for (const p of categoryPerms) next.add(p.id);
      }
      return next;
    });
    setSuccess("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { assignPermissionsToRole } = await import(
        "@/services/roles.service"
      );
      await assignPermissionsToRole(roleId, {
        permissionIds: [...selectedIds],
      });
      setSuccess(t("permissionsUpdated"));
    } catch {
      setError(t("failedSavePermissions"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormSection title={t("assignPermissions")}>
      {error && (
        <div className="mb-4 rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-[#ECFDF3] px-4 py-3 text-sm text-[#027A48] dark:bg-[#027A48]/10 dark:text-[#6CE9A6]">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {allCategories.map((category) => {
          const selectedCount = category.permissions.filter((p) =>
            selectedIds.has(p.id),
          ).length;
          const allSelected = selectedCount === category.permissions.length;

          return (
            <div
              key={category.code}
              className="rounded-lg border border-stroke p-3 dark:border-dark-3"
            >
              <label className="mb-2 flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el)
                      el.indeterminate = selectedCount > 0 && !allSelected;
                  }}
                  onChange={() => toggleCategory(category.permissions)}
                  disabled={isSystemRole}
                  className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
                />
                <span className="text-sm font-semibold text-dark dark:text-white">
                  {translateCategory(category)}
                </span>
                <span className="ml-auto text-xs text-dark-6">
                  {selectedCount}/{category.count}
                </span>
              </label>
              <div className="grid grid-cols-1 gap-1.5 pl-6 sm:grid-cols-2">
                {category.permissions.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition hover:bg-gray-2 dark:hover:bg-dark-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      disabled={isSystemRole}
                      className="h-3.5 w-3.5 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
                    />
                    <span className="text-dark dark:text-white">
                      {translatePerm(perm)}
                    </span>
                    <StatusBadge variant={getLevelVariant(perm.level)}>
                      {translateLevel(perm)}
                    </StatusBadge>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {allCategories.length === 0 && (
        <p className="py-4 text-center text-body-sm text-dark-6">
          {t("noPermissions")}
        </p>
      )}

      {!isSystemRole && (
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? tCommon("saving") : t("assignPermissions")}
          </button>
        </div>
      )}

      {isSystemRole && (
        <p className="mt-4 text-body-sm text-dark-6">
          {t("systemRoleReadOnly")}
        </p>
      )}
    </FormSection>
  );
}
