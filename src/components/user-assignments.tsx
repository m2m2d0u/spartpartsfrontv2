"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import { FormDialog } from "@/components/ui/form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { PermissionGate } from "@/components/PermissionGate";
import type { User, Permission } from "@/types";

type Props = {
  entityId: string;
  entityType: "store" | "warehouse";
  assignedUsers: User[];
  allUsers: User[];
  assignPermission: Permission;
  unassignPermission: Permission;
};

export function UserAssignments({
  entityId,
  entityType,
  assignedUsers: initialUsers,
  allUsers,
  assignPermission,
  unassignPermission,
}: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Add user dialog
  const [addOpen, setAddOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  // Remove dialog
  const [removeUser, setRemoveUser] = useState<User | null>(null);

  const tCommon = useTranslations("common");

  // Available users (not yet assigned)
  const assignedIds = new Set(users.map((u) => u.id));
  const availableUsers = allUsers
    .filter((u) => !assignedIds.has(u.id))
    .map((u) => ({ value: u.id, label: `${u.name} — ${u.email}` }));

  function handleOpenAdd() {
    setSelectedUserId("");
    setError("");
    setAddOpen(true);
  }

  async function handleAdd() {
    if (!selectedUserId) return;
    const user = allUsers.find((u) => u.id === selectedUserId);
    if (!user) return;

    setSaving(true);
    setError("");
    try {
      if (entityType === "store") {
        const { assignUserToStore } = await import(
          "@/services/stores.service"
        );
        await assignUserToStore(entityId, selectedUserId);
      } else {
        const { assignUserToWarehouse } = await import(
          "@/services/warehouses.service"
        );
        await assignUserToWarehouse(entityId, selectedUserId);
      }
      setUsers((prev) => [...prev, user]);
      setAddOpen(false);
    } catch {
      setError(tCommon("failedUserAssignment"));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!removeUser) return;

    setSaving(true);
    setError("");
    try {
      if (entityType === "store") {
        const { unassignUserFromStore } = await import(
          "@/services/stores.service"
        );
        await unassignUserFromStore(entityId, removeUser.id);
      } else {
        const { unassignUserFromWarehouse } = await import(
          "@/services/warehouses.service"
        );
        await unassignUserFromWarehouse(entityId, removeUser.id);
      }
      setUsers((prev) => prev.filter((u) => u.id !== removeUser.id));
      setRemoveUser(null);
    } catch {
      setError(tCommon("failedUserAssignment"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          {tCommon("assignedUsers")}
        </h3>
        <PermissionGate permission={assignPermission}>
          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={availableUsers.length === 0}
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
            {tCommon("assignUser")}
          </button>
        </PermissionGate>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <p className="py-8 text-center text-body-sm text-dark-6">
          {tCommon("noAssignedUsers")}
        </p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3"
            >
              <div>
                <div className="font-medium text-dark dark:text-white">
                  {user.name}
                </div>
                <div className="text-body-sm text-dark-6">{user.email}</div>
              </div>
              <div className="flex items-center gap-3">
                {user.roleDisplayName && (
                  <StatusBadge variant="info">
                    {user.roleDisplayName}
                  </StatusBadge>
                )}
                <PermissionGate permission={unassignPermission}>
                  <button
                    type="button"
                    onClick={() => setRemoveUser(user)}
                    className="text-body-sm text-red hover:underline"
                  >
                    {tCommon("remove")}
                  </button>
                </PermissionGate>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign user dialog */}
      <FormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        title={tCommon("assignUserTitle")}
        submitLabel={tCommon("assignUser")}
        cancelLabel={tCommon("cancel")}
        loading={saving}
      >
        <SearchableSelect
          label={tCommon("selectUser")}
          items={availableUsers}
          value={selectedUserId}
          onChange={setSelectedUserId}
          placeholder={tCommon("selectUser")}
          searchPlaceholder={tCommon("search")}
          required
        />
      </FormDialog>

      {/* Unassign confirmation */}
      <ConfirmDialog
        open={removeUser !== null}
        onClose={() => setRemoveUser(null)}
        onConfirm={handleRemove}
        title={tCommon("unassignUserTitle")}
        description={tCommon("unassignUserDescription")}
        confirmLabel={tCommon("remove")}
        variant="danger"
        loading={saving}
      />
    </div>
  );
}
