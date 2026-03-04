"use client";

import { useMemo, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { type Permission } from "@/types";

export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = user?.roleCode === "ADMIN";

  const allPermissions = useMemo(() => {
    if (!user || isAdmin) return new Set<string>();
    const perms = new Set<string>();
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
