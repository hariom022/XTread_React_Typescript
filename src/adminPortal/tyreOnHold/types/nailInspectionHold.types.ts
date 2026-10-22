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

export type NailInspectionHoldAction =
    | "LPO_RECEIVED"
    | "PAYMENT_RECEIVED"
    | "REJECT_ORDER";

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

export interface NailInspectionHoldCasing {
    orderCasingId: number;
    productionNumber: string;
    tyreReferenceNumber?: string | null;
    tyreSizeLabel?: string | null;
    tyreMakeName?: string | null;
    patternName?: string | null;
    inspectionStatus: CasingInspectionStatus;
}

export interface NailInspectionHoldOrderDetails
    extends NailInspectionHoldOrder {
    casings: NailInspectionHoldCasing[];
}

export interface NailInspectionHoldActionPayload {
    orderId: number;
    action: NailInspectionHoldAction;
}