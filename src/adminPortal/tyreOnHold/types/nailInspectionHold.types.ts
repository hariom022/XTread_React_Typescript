export interface NailInspectionHoldCasing {
  holdId: number;
  orderCasingId: number;
  lineNumber: number;
  casingStage: number;
  casingStageStatus: number;
  holdType: number;
  tyreReferenceNumber: string;
  productionNumber: string;
  tyreSizeLabel: string;
  tyreMakeName: string;
  serviceTypeName: string;
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

export type NailInspectionHoldOrderDetails = NailInspectionHoldOrder;

export type NailInspectionHoldAction =
  | "LPO_RECEIVED"
  | "PAYMENT_RECEIVED"
  | "REJECT_ORDER";

export interface NailInspectionHoldActionPayload {
  orderId: number;
  action: NailInspectionHoldAction;
}

export type CommercialRequirement = "LPO" | "PAYMENT";

export type NailInspectionHoldStatus =
    | "PENDING"
    | "READY"
    | "CONFIRMED"
    | "REJECTED";

export type CasingInspectionStatus =
    | "APPROVED"
    | "REJECTED"
    | "PENDING";

// export type NailInspectionHoldAction =
//     | "LPO_RECEIVED"
//     | "PAYMENT_RECEIVED"
//     | "REJECT_ORDER";

export interface NailInspectionHoldOrder {
    orderId: number;
    orderNumber: string;
    orderDate?: string | null;
    customerName: string;
    serviceTypeName?: string | null;
    commercialRequirement: CommercialRequirement;
    holdStatus: NailInspectionHoldStatus;
    totalCasings: number;
    approvedCasings: number;
    rejectedCasings: number;
    pendingCasings: number;
}

// export interface NailInspectionHoldCasing {
//     orderCasingId: number;
//     productionNumber: string;
//     tyreReferenceNumber?: string | null;
//     tyreSizeLabel?: string | null;
//     tyreMakeName?: string | null;
//     patternName?: string | null;
//     inspectionStatus: CasingInspectionStatus;
// }

// export interface NailInspectionHoldOrderDetails
//     extends NailInspectionHoldOrder {
//     casings: NailInspectionHoldCasing[];
// }

export interface NailInspectionHoldActionPayload {
    orderId: number;
    action: NailInspectionHoldAction;
}

