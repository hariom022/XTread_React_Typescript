
export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface CategoryApiResponse {
  success: boolean;
  data: Category[];
  error: string | null;
}

export interface TyreMake {
  tyreMakeId: number;
  tyreMakeName: string;
  tyreClassificationId: number;
  tyreClassificationName: string;
  tyreClassificationSortOrder: number;
  sortOrder: number;
}

export interface TyreMakeApiResponse {
  success: boolean;
  data: TyreMake[];
  error: string | null;
}

export interface TyreClassification {
  tyreClassificationId: number;
  tyreClassificationName: string;
  tyreClassificationSortOrder: number;
}

export interface TreadPatternVariant {
  treadPatternVariantId: number;
  width: number;
  sapCode: string;
  sapDescription: string;
  tyreSizeId: number | null;
  tyreSizeName: string | null;
  sortOrder: number;
}

export interface TreadPattern {
  treadPatternId: number;
  brand: string;
  patternName: string;
  categoryId: number;
  categoryName: string;
  tyreClassificationId: number;
  tyreClassificationName: string;
  tyreClassificationSortOrder: number;
  sortOrder: number;
  variants: TreadPatternVariant[];
}

export interface TreadPatternApiResponse {
  success: boolean;
  data: TreadPattern[];
  error: string | null;
}
