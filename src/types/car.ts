/** Mirrors backend CarBrandResponse */
export type CarBrand = {
  id: string;
  name: string;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend CarModelResponse */
export type CarModel = {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  yearFrom: number | null;
  yearTo: number | null;
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend TagResponse */
export type Tag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
