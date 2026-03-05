"use client";

import { useMemo, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import type { Permission } from "@/types";

export function usePermissions() {
  const { user } = useAuth();

  const allPermissions = useMemo(() => {
    if (!user) return new Set<string>();
    const perms = new Set<string>();
    // Role-level permissions
    if (user.permissions) {
      for (const p of user.permissions) {
        perms.add(p);
      }
    }
    // Warehouse-assignment-level permissions
    if (user.warehouseAssignments) {
      for (const assignment of user.warehouseAssignments) {
        for (const p of assignment.permissions) {
          perms.add(p);
        }
      }
    }
    return perms;
  }, [user]);

  const hasPermission = useCallback(
    (code: Permission): boolean => {
      return allPermissions.has(code);
    },
    [allPermissions],
  );

  const hasAnyPermission = useCallback(
    (codes: Permission[]): boolean => {
      return codes.some((code) => allPermissions.has(code));
    },
    [allPermissions],
  );

  return { hasPermission, hasAnyPermission };
}
