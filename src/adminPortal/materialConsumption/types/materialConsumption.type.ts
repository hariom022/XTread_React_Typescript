export interface MaterialConsumed {
  orderCasingMaterialConsumptionId:number;
  material?: string;
  prodHierarchy4?: string;
  consumedQuantity?: number;
  unitOfMeasure?: string;
  casingStageName?: string;
  isApproved?: boolean;
  materialDescription:string;
  consumptionType:number;
  recommendedQuantity:number;
  casingStageId:number;
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