export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface CategoryApiResponse {
  success: boolean;
  data: Category[];
  error: unknown;
}