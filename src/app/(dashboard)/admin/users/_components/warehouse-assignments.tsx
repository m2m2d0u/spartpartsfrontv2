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
} from "@/types";
import { PERMISSIONS_BY_CATEGORY } from "@/types";

const CATEGORIES = Object.keys(PERMISSIONS_BY_CATEGORY) as PermissionCategory[];

type Props = {
  userId: string;
  assignments: UserWarehouseAssignment[];
  warehouses: Warehouse[];
};

export function WarehouseAssignments({
  userId,
  assignments: initialAssignments,
  warehouses,
}: Props) {
  const [assignments, setAssignments] =
    useState<UserWarehouseAssignment[]>(initialAssignments);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Add warehouse dialog
  const [addOpen, setAddOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<
    WarehousePermission[]
  >([]);

  // Edit permissions dialog
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editPermissions, setEditPermissions] = useState<
    WarehousePermission[]
  >([]);

  // Remove dialog
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const t = useTranslations("users");
  const tCommon = useTranslations("common");

  // Available warehouses (not yet assigned)
  const assignedWarehouseIds = new Set(assignments.map((a) => a.warehouseId));
  const availableWarehouses = warehouses
    .filter((w) => !assignedWarehouseIds.has(w.id))
    .map((w) => ({ value: w.id, label: `${w.code} — ${w.name}` }));

  async function saveAssignments(updated: UserWarehouseAssignment[]) {
    setSaving(true);
    setError("");
    try {
      const { updateUserWarehouses } = await import(
        "@/services/users.service"
      );
      const payload = updated.map((a) => ({
        warehouseId: a.warehouseId,
        permissions: a.permissions,
      }));
      await updateUserWarehouses(userId, payload);
      setAssignments(updated);
    } catch {
      setError(t("failedSaveAssignments"));
    } finally {
      setSaving(false);
    }
  }

  function handleOpenAdd() {
    setSelectedWarehouse("");
    setSelectedPermissions([]);
    setError("");
    setAddOpen(true);
  }

  async function handleAdd() {
    if (!selectedWarehouse || selectedPermissions.length === 0) return;
    const warehouse = warehouses.find((w) => w.id === selectedWarehouse);
    if (!warehouse) return;

    const newAssignment: UserWarehouseAssignment = {
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      warehouseCode: warehouse.code,
      permissions: selectedPermissions,
    };

    const updated = [...assignments, newAssignment];
    await saveAssignments(updated);
    setAddOpen(false);
  }

  function handleOpenEdit(index: number) {
    setEditIndex(index);
    setEditPermissions([...assignments[index].permissions]);
    setError("");
  }

  async function handleSaveEdit() {
    if (editIndex === null || editPermissions.length === 0) return;
    const updated = assignments.map((a, i) =>
      i === editIndex ? { ...a, permissions: editPermissions } : a,
    );
    await saveAssignments(updated);
    setEditIndex(null);
  }

  async function handleRemove() {
    if (removeIndex === null) return;
    const updated = assignments.filter((_, i) => i !== removeIndex);
    await saveAssignments(updated);
    setRemoveIndex(null);
  }

  function togglePermission(
    perm: WarehousePermission,
    list: WarehousePermission[],
    setList: (v: WarehousePermission[]) => void,
  ) {
    if (list.includes(perm)) {
      setList(list.filter((p) => p !== perm));
    } else {
      setList([...list, perm]);
    }
  }

  function toggleCategory(
    category: PermissionCategory,
    list: WarehousePermission[],
    setList: (v: WarehousePermission[]) => void,
  ) {
    const perms = PERMISSIONS_BY_CATEGORY[category];
    const allSelected = perms.every((p) => list.includes(p));
    if (allSelected) {
      setList(list.filter((p) => !perms.includes(p)));
    } else {
      const merged = new Set([...list, ...perms]);
      setList([...merged]);
    }
  }

  function PermissionCheckboxes({
    permissions,
    onChange,
    onToggleCategory,
  }: {
    permissions: WarehousePermission[];
    onChange: (perm: WarehousePermission) => void;
    onToggleCategory: (cat: PermissionCategory) => void;
  }) {
    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <label className="block text-body-sm font-medium text-dark dark:text-white">
          {t("permissions")}
        </label>
        {CATEGORIES.map((cat) => {
          const perms = PERMISSIONS_BY_CATEGORY[cat];
          const selectedCount = perms.filter((p) =>
            permissions.includes(p),
          ).length;
          const allSelected = selectedCount === perms.length;

          return (
            <div
              key={cat}
              className="rounded-lg border border-stroke p-3 dark:border-dark-3"
            >
              <label className="flex cursor-pointer items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = selectedCount > 0 && !allSelected;
                  }}
                  onChange={() => onToggleCategory(cat)}
                  className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
                />
                <span className="text-sm font-semibold text-dark dark:text-white">
                  {t(`cat_${cat}`)}
                </span>
                <span className="ml-auto text-xs text-dark-6">
                  {selectedCount}/{perms.length}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 pl-6">
                {perms.map((perm) => (
                  <label
                    key={perm}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition hover:bg-gray-2 dark:hover:bg-dark-3"
                  >
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm)}
                      onChange={() => onChange(perm)}
                      className="h-3.5 w-3.5 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
                    />
                    <span className="text-dark dark:text-white">
                      {t(`perm_${perm}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /** Group displayed permissions by category */
  function groupPermissions(perms: WarehousePermission[]) {
    const grouped: Partial<Record<PermissionCategory, WarehousePermission[]>> = {};
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
                      {tCommon("edit")}
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
        <PermissionCheckboxes
          permissions={selectedPermissions}
          onChange={(perm) =>
            togglePermission(perm, selectedPermissions, setSelectedPermissions)
          }
          onToggleCategory={(cat) =>
            toggleCategory(cat, selectedPermissions, setSelectedPermissions)
          }
        />
      </FormDialog>

      {/* Edit permissions dialog */}
      <FormDialog
        open={editIndex !== null}
        onClose={() => setEditIndex(null)}
        onSubmit={handleSaveEdit}
        title={t("editPermissions")}
        submitLabel={tCommon("save")}
        cancelLabel={tCommon("cancel")}
        loading={saving}
      >
        {editIndex !== null && (
          <>
            <p className="text-body-sm text-dark-6">
              {assignments[editIndex]?.warehouseName} (
              {assignments[editIndex]?.warehouseCode})
            </p>
            <PermissionCheckboxes
              permissions={editPermissions}
              onChange={(perm) =>
                togglePermission(perm, editPermissions, setEditPermissions)
              }
              onToggleCategory={(cat) =>
                toggleCategory(cat, editPermissions, setEditPermissions)
              }
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
