export interface QualityControlRow {
  orderCasingId: number;
  productionNumber: string;
  orderDate: string;
  tyreReferenceNumber: string;
  patternName: string;
  tyreSize: string;
  customerName: string;
  serviceTypeName: string;
  batchNumber?: string;
}

export interface QualityControlDetails
  extends QualityControlRow {
  requestedPattern?: string;
  approvedPattern?: string;
  approvedTreadWidth?: string;
  repairDetails?: any[];
}