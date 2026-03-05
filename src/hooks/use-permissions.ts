"use client";

import { useMemo, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { getTokenPermissions } from "@/services/auth.service";
import type { Permission } from "@/types";
import type { RoleLevel } from "@/types/role";

export function usePermissions() {
  const { user } = useAuth();

  const allPermissions = useMemo(() => {
    if (!user) return new Set<string>();
    const perms = new Set<string>();
    // Role-level permissions from JWT token
    for (const p of getTokenPermissions()) {
      perms.add(p);
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

  const roleLevel: RoleLevel | undefined = user?.roleLevel;
  const isSuperAdmin = user?.superAdmin === true;

  return { hasPermission, hasAnyPermission, roleLevel, isSuperAdmin };
}
