"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CarBrand, CarModel } from "@/types";

type LookupContextType = {
  brands: CarBrand[];
  models: CarModel[];
  loadingBrands: boolean;
  loadingModels: boolean;
  getModelsByBrand: (brandId: string) => CarModel[];
  invalidateBrands: () => void;
  invalidateModels: () => void;
};

const LookupContext = createContext<LookupContextType | null>(null);

export function LookupProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(true);
  const [brandVersion, setBrandVersion] = useState(0);
  const [modelVersion, setModelVersion] = useState(0);

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

  return (
    <LookupContext.Provider
      value={{
        brands,
        models,
        loadingBrands,
        loadingModels,
        getModelsByBrand,
        invalidateBrands,
        invalidateModels,
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
