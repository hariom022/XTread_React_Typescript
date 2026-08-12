export interface RejectedTyre {
  orderCasingId: number;
  orderId: number;
  orderNumber: string;
  batchNumber: string;
  tyreReferenceNumber: string;
  dotNumber: string;
  productionNumber: string;
  barcodeNumber: string;

  categoryId: number;
  categoryName: string;

  serviceTypeId: number;
  serviceTypeName: string;

  tyreMakeName: string;
  customerName: string;

  rejectedAtStage: number;
  rejectedAtStageName: string;

  rejectionReason: string | null;
  rejectionReasonName: string | null;

  rejectedAtUtc: string;
}