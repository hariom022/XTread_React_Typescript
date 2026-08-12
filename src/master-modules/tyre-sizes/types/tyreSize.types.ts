export interface TyreSize {
  id: number;
  categoryId: number;
  casingSize: string;
  rim: number;
  averageCircumferenceMm: number;
  minimumMm: number;
  maximumMm: number;
  displayOrder: number;
}

export interface TyreSizeApiResponse {
  success: boolean;
  data: TyreSize[];
  error: unknown;
}