export interface NailInspectionHoldCasing {
  holdId: number;
  orderCasingId: number;
  lineNumber: number;
  casingStage: number;
  casingStageStatus: number;
  holdType: number;
  tyreReferenceNumber: string | null;
  productionNumber: string | null;
  tyreSizeLabel: string | null;
  tyreMakeName: string | null;
  serviceTypeName: string | null;
  createdAtUtc: string;
}

export interface NailInspectionHoldOrder {
  orderId: number;
  orderNumber: string;
  customerName: string;
  holdType: number;
  requiresLpo: boolean;
  requiresPayment: boolean;
  casings: NailInspectionHoldCasing[];
}

export type NailInspectionHoldAction =
  | "LPO_RECEIVED"
  | "PAYMENT_RECEIVED"
  | "REJECT_ORDER";

export interface NailInspectionHoldActionPayload {
  orderId: number;
  action: NailInspectionHoldAction;
}

export interface NailInspectionHoldOrderDetails
  extends NailInspectionHoldOrder {}