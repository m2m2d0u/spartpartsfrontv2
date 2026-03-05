"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CarBrand, CarModel, Tag, Role } from "@/types";

type LookupContextType = {
  brands: CarBrand[];
  models: CarModel[];
  tags: Tag[];
  roles: Role[];
  loadingBrands: boolean;
  loadingModels: boolean;
  loadingTags: boolean;
  loadingRoles: boolean;
  getModelsByBrand: (brandId: string) => CarModel[];
  getRoleByCode: (code: string) => Role | undefined;
  invalidateBrands: () => void;
  invalidateModels: () => void;
  invalidateTags: () => void;
  invalidateRoles: () => void;
};

const LookupContext = createContext<LookupContextType | null>(null);

export function LookupProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [brandVersion, setBrandVersion] = useState(0);
  const [modelVersion, setModelVersion] = useState(0);
  const [tagVersion, setTagVersion] = useState(0);
  const [roleVersion, setRoleVersion] = useState(0);

  // Fetch brands
  useEffect(() => {
    let cancelled = false;
    setLoadingBrands(true);

    (async () => {
      try {
        const { apiGet } = await import("@/services/api-client");
        const data = await apiGet<CarBrand[]>("/car-brands/list");
        if (!cancelled) setBrands(data);
      } catch {
        // silently fail — list stays empty
      } finally {
        if (!cancelled) setLoadingBrands(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [brandVersion]);

  // Fetch models
  useEffect(() => {
    let cancelled = false;
    setLoadingModels(true);

    (async () => {
      try {
        const { apiGet } = await import("@/services/api-client");
        const data = await apiGet<CarModel[]>("/car-models/list");
        if (!cancelled) setModels(data);
      } catch {
        // silently fail — list stays empty
      } finally {
        if (!cancelled) setLoadingModels(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [modelVersion]);

  // Fetch tags
  useEffect(() => {
    let cancelled = false;
    setLoadingTags(true);

    (async () => {
      try {
        const { apiGet } = await import("@/services/api-client");
        const data = await apiGet<Tag[]>("/tags/list");
        if (!cancelled) setTags(data);
      } catch {
        // silently fail — list stays empty
      } finally {
        if (!cancelled) setLoadingTags(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tagVersion]);

  // Fetch roles
  useEffect(() => {
    let cancelled = false;
    setLoadingRoles(true);

    (async () => {
      try {
        const { apiGet } = await import("@/services/api-client");
        const data = await apiGet<Role[]>("/roles/active");
        if (!cancelled) setRoles(data);
      } catch {
        // silently fail — list stays empty
      } finally {
        if (!cancelled) setLoadingRoles(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roleVersion]);

  const getModelsByBrand = useCallback(
    (brandId: string) => models.filter((m) => m.brandId === brandId),
    [models],
  );

  const invalidateBrands = useCallback(
    () => setBrandVersion((v) => v + 1),
    [],
  );

  const invalidateModels = useCallback(
    () => setModelVersion((v) => v + 1),
    [],
  );

  const invalidateTags = useCallback(
    () => setTagVersion((v) => v + 1),
    [],
  );

  const getRoleByCode = useCallback(
    (code: string) => roles.find((r) => r.code === code),
    [roles],
  );

  const invalidateRoles = useCallback(
    () => setRoleVersion((v) => v + 1),
    [],
  );

  return (
    <LookupContext.Provider
      value={{
        brands,
        models,
        tags,
        roles,
        loadingBrands,
        loadingModels,
        loadingTags,
        loadingRoles,
        getModelsByBrand,
        getRoleByCode,
        invalidateBrands,
        invalidateModels,
        invalidateTags,
        invalidateRoles,
      }}
    >
      {children}
    </LookupContext.Provider>
  );
}

export function useLookup(): LookupContextType {
  const ctx = useContext(LookupContext);
  if (!ctx) {
    throw new Error("useLookup must be used within a <LookupProvider>");
  }
  return ctx;
}
