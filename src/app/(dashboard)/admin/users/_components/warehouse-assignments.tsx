"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import { FormDialog } from "@/components/ui/form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Warehouse, UserWarehouseAssignment } from "@/types";

type Props = {
  userId: string;
  assignments: UserWarehouseAssignment[];
};

export function WarehouseAssignments({
  userId,
  assignments: initialAssignments,
}: Props) {
  const [assignments, setAssignments] =
    useState<UserWarehouseAssignment[]>(initialAssignments);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Add warehouse dialog
  const [addOpen, setAddOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  // Search state
  const [searchResults, setSearchResults] = useState<Warehouse[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Remove dialog
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const t = useTranslations("users");
  const tCommon = useTranslations("common");

  const assignedWarehouseIds = new Set(assignments.map((a) => a.warehouseId));

  const availableItems = searchResults
    .filter((w) => !assignedWarehouseIds.has(w.id))
    .map((w) => ({ value: w.id, label: `${w.code} — ${w.name}` }));

  const handleWarehouseSearch = useCallback((term: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { searchWarehouses } = await import(
          "@/services/warehouses.service"
        );
        const results = await searchWarehouses(term);
        setSearchResults(results);
      } catch {
        // silent
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  function handleOpenAdd() {
    setSelectedWarehouse("");
    setSearchResults([]);
    setError("");
    setAddOpen(true);
  }

  async function handleAdd() {
    if (!selectedWarehouse) return;
    const warehouse = searchResults.find((w) => w.id === selectedWarehouse);
    if (!warehouse) return;

    setSaving(true);
    setError("");
    try {
      const { assignUserToWarehouse } = await import(
        "@/services/warehouses.service"
      );
      await assignUserToWarehouse(warehouse.id, userId);
      setAssignments((prev) => [
        ...prev,
        {
          warehouseId: warehouse.id,
          warehouseName: warehouse.name,
          warehouseCode: warehouse.code,
          permissions: [],
        },
      ]);
      setAddOpen(false);
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
      const { unassignUserFromWarehouse } = await import(
        "@/services/warehouses.service"
      );
      await unassignUserFromWarehouse(assignment.warehouseId, userId);
      setAssignments((prev) => prev.filter((_, i) => i !== removeIndex));
      setRemoveIndex(null);
    } catch {
      setError(t("failedSaveAssignments"));
    } finally {
      setSaving(false);
    }
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
          {assignments.map((assignment, index) => (
            <div
              key={assignment.warehouseId}
              className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3"
            >
              <div>
                <div className="font-medium text-dark dark:text-white">
                  {assignment.warehouseName}
                  <span className="ml-2 text-body-sm text-dark-6">
                    ({assignment.warehouseCode})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRemoveIndex(index)}
                className="text-body-sm text-red hover:underline"
              >
                {tCommon("remove")}
              </button>
            </div>
          ))}
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
          items={availableItems}
          value={selectedWarehouse}
          onChange={setSelectedWarehouse}
          placeholder={t("selectWarehouse")}
          searchPlaceholder={tCommon("search")}
          onSearch={handleWarehouseSearch}
          searching={searching}
          required
        />
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
