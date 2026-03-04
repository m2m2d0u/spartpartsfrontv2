"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import { FormDialog } from "@/components/ui/form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Store, UserStoreAssignment } from "@/types";

type Props = {
  userId: string;
  assignments: UserStoreAssignment[];
};

export function StoreAssignments({
  userId,
  assignments: initialAssignments,
}: Props) {
  const [assignments, setAssignments] =
    useState<UserStoreAssignment[]>(initialAssignments);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Add store dialog
  const [addOpen, setAddOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");

  // Search state
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Remove dialog
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const t = useTranslations("users");
  const tCommon = useTranslations("common");

  const assignedStoreIds = new Set(assignments.map((a) => a.storeId));

  const availableItems = searchResults
    .filter((s) => !assignedStoreIds.has(s.id))
    .map((s) => ({ value: s.id, label: `${s.code} — ${s.name}` }));

  const handleStoreSearch = useCallback((term: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { searchStores } = await import("@/services/stores.service");
        const results = await searchStores(term);
        setSearchResults(results);
      } catch {
        // silent
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  function handleOpenAdd() {
    setSelectedStore("");
    setSearchResults([]);
    setError("");
    setAddOpen(true);
  }

  async function handleAdd() {
    if (!selectedStore) return;
    const store = searchResults.find((s) => s.id === selectedStore);
    if (!store) return;

    setSaving(true);
    setError("");
    try {
      const { assignUserToStore } = await import("@/services/stores.service");
      await assignUserToStore(store.id, userId);
      setAssignments((prev) => [
        ...prev,
        {
          id: "",
          storeId: store.id,
          storeName: store.name,
          storeCode: store.code,
          createdAt: new Date().toISOString(),
        },
      ]);
      setAddOpen(false);
    } catch {
      setError(t("failedSaveStores"));
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
      const { unassignUserFromStore } = await import(
        "@/services/stores.service"
      );
      await unassignUserFromStore(assignment.storeId, userId);
      setAssignments((prev) => prev.filter((_, i) => i !== removeIndex));
      setRemoveIndex(null);
    } catch {
      setError(t("failedSaveStores"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          {t("storeAssignments")}
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
          {t("addStore")}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
          {error}
        </div>
      )}

      {assignments.length === 0 ? (
        <p className="py-8 text-center text-body-sm text-dark-6">
          {t("noStoreAssignments")}
        </p>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment, index) => (
            <div
              key={assignment.storeId}
              className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3"
            >
              <div>
                <div className="font-medium text-dark dark:text-white">
                  {assignment.storeName}
                  <span className="ml-2 text-body-sm text-dark-6">
                    ({assignment.storeCode})
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

      {/* Add store dialog */}
      <FormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        title={t("addStoreTitle")}
        submitLabel={tCommon("add")}
        cancelLabel={tCommon("cancel")}
        loading={saving}
      >
        <SearchableSelect
          label={t("store")}
          items={availableItems}
          value={selectedStore}
          onChange={setSelectedStore}
          placeholder={t("selectStore")}
          searchPlaceholder={tCommon("search")}
          onSearch={handleStoreSearch}
          searching={searching}
          required
        />
      </FormDialog>

      {/* Remove confirmation */}
      <ConfirmDialog
        open={removeIndex !== null}
        onClose={() => setRemoveIndex(null)}
        onConfirm={handleRemove}
        title={t("removeStoreTitle")}
        description={t("removeStoreDescription")}
        confirmLabel={tCommon("remove")}
        variant="danger"
        loading={saving}
      />
    </div>
  );
}
