"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import { FormDialog } from "@/components/ui/form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type {
  Warehouse,
  UserWarehouseAssignment,
  WarehousePermission,
  PermissionCategory,
  Role,
} from "@/types";
import { PERMISSIONS_BY_CATEGORY } from "@/types";

const CATEGORIES = Object.keys(PERMISSIONS_BY_CATEGORY) as PermissionCategory[];

type Props = {
  userId: string;
  assignments: UserWarehouseAssignment[];
  warehouses: Warehouse[];
  roles: Role[];
};

export function WarehouseAssignments({
  userId,
  assignments: initialAssignments,
  warehouses,
  roles,
}: Props) {
  const [assignments, setAssignments] =
    useState<UserWarehouseAssignment[]>(initialAssignments);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Add warehouse dialog
  const [addOpen, setAddOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(
    new Set(),
  );

  // Edit roles dialog
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editRoleIds, setEditRoleIds] = useState<Set<string>>(new Set());

  // Remove dialog
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const tRoles = useTranslations("roles");

  function translateRole(role: Role) {
    const key = `role_${role.code}` as Parameters<typeof tRoles>[0];
    return tRoles.has(key) ? tRoles(key) : role.displayName;
  }

  // Available warehouses (not yet assigned)
  const assignedWarehouseIds = new Set(assignments.map((a) => a.warehouseId));
  const availableWarehouses = warehouses
    .filter((w) => !assignedWarehouseIds.has(w.id))
    .map((w) => ({ value: w.id, label: `${w.code} — ${w.name}` }));

  async function handleAdd() {
    if (!selectedWarehouse || selectedRoleIds.size === 0) return;
    setSaving(true);
    setError("");
    try {
      const { assignRolesToUserWarehouse } = await import(
        "@/services/roles.service"
      );
      await assignRolesToUserWarehouse(userId, {
        warehouseId: selectedWarehouse,
        roleIds: [...selectedRoleIds],
      });
      // Optimistic: add to local list with warehouse info
      const warehouse = warehouses.find((w) => w.id === selectedWarehouse);
      if (warehouse) {
        setAssignments((prev) => [
          ...prev,
          {
            warehouseId: warehouse.id,
            warehouseName: warehouse.name,
            warehouseCode: warehouse.code,
            permissions: [], // Will be populated on next server fetch
          },
        ]);
      }
      setAddOpen(false);
    } catch {
      setError(t("failedSaveAssignments"));
    } finally {
      setSaving(false);
    }
  }

  function handleOpenAdd() {
    setSelectedWarehouse("");
    setSelectedRoleIds(new Set());
    setError("");
    setAddOpen(true);
  }

  function handleOpenEdit(index: number) {
    setEditIndex(index);
    setEditRoleIds(new Set());
    setError("");
  }

  async function handleSaveEdit() {
    if (editIndex === null || editRoleIds.size === 0) return;
    const assignment = assignments[editIndex];
    setSaving(true);
    setError("");
    try {
      const { assignRolesToUserWarehouse } = await import(
        "@/services/roles.service"
      );
      await assignRolesToUserWarehouse(userId, {
        warehouseId: assignment.warehouseId,
        roleIds: [...editRoleIds],
      });
      setEditIndex(null);
    } catch {
      setError(t("failedSaveAssignments"));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (removeIndex === null) return;
    const assignment = assignments[removeIndex];
    setSaving(true);
    setError("");
    try {
      const { assignRolesToUserWarehouse } = await import(
        "@/services/roles.service"
      );
      // Remove by assigning empty roles
      await assignRolesToUserWarehouse(userId, {
        warehouseId: assignment.warehouseId,
        roleIds: [],
      });
      setAssignments((prev) => prev.filter((_, i) => i !== removeIndex));
      setRemoveIndex(null);
    } catch {
      setError(t("failedSaveAssignments"));
    } finally {
      setSaving(false);
    }
  }

  function toggleRole(
    roleId: string,
    current: Set<string>,
    setter: (v: Set<string>) => void,
  ) {
    const next = new Set(current);
    if (next.has(roleId)) {
      next.delete(roleId);
    } else {
      next.add(roleId);
    }
    setter(next);
  }

  function RoleCheckboxes({
    selected,
    onToggle,
  }: {
    selected: Set<string>;
    onToggle: (roleId: string) => void;
  }) {
    return (
      <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
        <label className="block text-body-sm font-medium text-dark dark:text-white">
          {t("selectRoles")}
        </label>
        {roles.map((role) => (
          <label
            key={role.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-stroke p-3 transition hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-3"
          >
            <input
              type="checkbox"
              checked={selected.has(role.id)}
              onChange={() => onToggle(role.id)}
              className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-dark dark:text-white">
                {translateRole(role)}
              </span>
              {role.description && (
                <p className="text-xs text-dark-6">{role.description}</p>
              )}
              <span className="text-xs text-dark-6">
                {role.permissionCount} {t("permissions").toLowerCase()}
              </span>
            </div>
            {role.isSystem && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {t("systemRole")}
              </span>
            )}
          </label>
        ))}
        {roles.length === 0 && (
          <p className="py-4 text-center text-body-sm text-dark-6">
            {t("noRolesAvailable")}
          </p>
        )}
      </div>
    );
  }

  /** Group displayed permissions by category */
  function groupPermissions(perms: WarehousePermission[]) {
    const grouped: Partial<
      Record<PermissionCategory, WarehousePermission[]>
    > = {};
    for (const perm of perms) {
      for (const cat of CATEGORIES) {
        if (PERMISSIONS_BY_CATEGORY[cat].includes(perm)) {
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat]!.push(perm);
          break;
        }
      }
    }
    return grouped;
  }

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          {t("warehouseAssignments")}
        </h3>
        <button
          type="button"
          onClick={handleOpenAdd}
          disabled={availableWarehouses.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {t("addWarehouse")}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
          {error}
        </div>
      )}

      {assignments.length === 0 ? (
        <p className="py-8 text-center text-body-sm text-dark-6">
          {t("noAssignments")}
        </p>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment, index) => {
            const grouped = groupPermissions(assignment.permissions);
            return (
              <div
                key={assignment.warehouseId}
                className="rounded-lg border border-stroke p-4 dark:border-dark-3"
              >
                <div className="flex items-start justify-between">
                  <div className="font-medium text-dark dark:text-white">
                    {assignment.warehouseName}
                    <span className="ml-2 text-body-sm text-dark-6">
                      ({assignment.warehouseCode})
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(index)}
                      className="text-body-sm text-primary hover:underline"
                    >
                      {t("editRoles")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRemoveIndex(index)}
                      className="text-body-sm text-red hover:underline"
                    >
                      {tCommon("remove")}
                    </button>
                  </div>
                </div>
                {/* Derived permissions (read-only display) */}
                {Object.keys(grouped).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {Object.entries(grouped).map(([cat, perms]) => (
                      <div key={cat}>
                        <span className="text-xs font-semibold uppercase text-dark-6">
                          {t(`cat_${cat}`)}
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {perms!.map((perm) => (
                            <span
                              key={perm}
                              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                              {t(`perm_${perm}`)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add warehouse dialog */}
      <FormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        title={t("addWarehouseTitle")}
        submitLabel={tCommon("add")}
        cancelLabel={tCommon("cancel")}
        loading={saving}
      >
        <SearchableSelect
          label={t("warehouse")}
          items={availableWarehouses}
          value={selectedWarehouse}
          onChange={setSelectedWarehouse}
          placeholder={t("selectWarehouse")}
          searchPlaceholder={tCommon("search")}
          required
        />
        <RoleCheckboxes
          selected={selectedRoleIds}
          onToggle={(id) => toggleRole(id, selectedRoleIds, setSelectedRoleIds)}
        />
      </FormDialog>

      {/* Edit roles dialog */}
      <FormDialog
        open={editIndex !== null}
        onClose={() => setEditIndex(null)}
        onSubmit={handleSaveEdit}
        title={t("editRoles")}
        submitLabel={tCommon("save")}
        cancelLabel={tCommon("cancel")}
        loading={saving}
      >
        {editIndex !== null && (
          <>
            <p className="text-body-sm text-dark-6">
              {t("rolesForWarehouse")}: {assignments[editIndex]?.warehouseName} (
              {assignments[editIndex]?.warehouseCode})
            </p>
            <RoleCheckboxes
              selected={editRoleIds}
              onToggle={(id) => toggleRole(id, editRoleIds, setEditRoleIds)}
            />
          </>
        )}
      </FormDialog>

      {/* Remove confirmation */}
      <ConfirmDialog
        open={removeIndex !== null}
        onClose={() => setRemoveIndex(null)}
        onConfirm={handleRemove}
        title={t("removeWarehouseTitle")}
        description={t("removeWarehouseDescription")}
        confirmLabel={tCommon("remove")}
        variant="danger"
        loading={saving}
      />
    </div>
  );
}
