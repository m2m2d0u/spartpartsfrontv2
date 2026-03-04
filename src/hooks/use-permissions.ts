"use client";

import { useMemo, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { type Permission, UserRoleCode } from "@/types";

export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = user?.roleCode === UserRoleCode.ADMINISTRATEUR;

  const allPermissions = useMemo(() => {
    if (!user || isAdmin) return new Set<string>();
    const perms = new Set<string>();
    // Role-level permissions
    if (user.permissions) {
      for (const p of user.permissions) {
        perms.add(p);
      }
    }
    // Warehouse-assignment-level permissions
    for (const assignment of user.warehouseAssignments) {
      for (const p of assignment.permissions) {
        perms.add(p);
      }
    }
    return perms;
  }, [user, isAdmin]);

  const hasPermission = useCallback(
    (code: Permission): boolean => {
      if (isAdmin) return true;
      return allPermissions.has(code);
    },
    [isAdmin, allPermissions],
  );

  const hasAnyPermission = useCallback(
    (codes: Permission[]): boolean => {
      if (isAdmin) return true;
      return codes.some((code) => allPermissions.has(code));
    },
    [isAdmin, allPermissions],
  );

  return { hasPermission, hasAnyPermission, isAdmin };
}
