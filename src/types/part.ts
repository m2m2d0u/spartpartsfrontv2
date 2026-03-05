/** Mirrors backend PartImageResponse */
export type PartImage = {
  id: string;
  url: string;
  sortOrder: number;
};

/** Mirrors backend PartResponse */
export type Part = {
  id: string;
  partNumber: string;
  reference: string | null;
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string | null;
  categoryName: string | null;
  carBrandId: string | null;
  carBrandName: string | null;
  carModelId: string | null;
  carModelName: string | null;
  sellingPrice: number;
  purchasePrice: number;
  minStockLevel: number;
  published: boolean;
  notes: string;
  images: PartImage[];
  tags: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend CreatePartRequest */
export type CreatePartRequest = {
  partNumber: string;
  reference?: string;
  name: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  carBrandId?: string;
  carModelId?: string;
  tagIds?: string[];
  sellingPrice: number;
  purchasePrice: number;
  minStockLevel?: number;
  published?: boolean;
  notes?: string;
};

/** Mirrors backend UpdatePartRequest */
export type UpdatePartRequest = CreatePartRequest;

/** Mirrors backend CategoryResponse */
export type Category = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
