export interface MaterialConsumed {
  material?: string;
  prodHierarchy4?: string;
  quantity?: number;
  unitOfMeasure?: string;
  casingStageName?: string;
  isApproved?: boolean;
}

export interface MaterialConsumption {
  orderCasingId: number;
  orderNumber?: string;
  tyreReferenceNumber?: string;
  productionNumber?: string;
  batchNumber?: string;
  barcodeNumber?: string;
  customerName?: string;

  materialConsumed?: MaterialConsumed[];
}

export interface MaterialConsumptionPagedResponse {
  items: MaterialConsumption[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}