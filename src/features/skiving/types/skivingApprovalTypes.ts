export interface RepairOperation {
    repairType: string;
    repairLocation: string;
}

export interface RejectionReason {
    rejectionReasonId: number;
    code: string;
    reason: string;
}

export interface skivingApprovalRow {
    id: number;

    casing: string;
    date: string;
    serial: string;

    pattern: string;

    requestedPattern: string;
    reApprovedPattern?: string;

    tyreSize: string;
    tyreMake: string;

    model: string;
    brand: string;
    width: string;

    customerName: string;
    service: string;

    batchNo: string;

    tyresCollected: number;
    tyresAvailable: number;

    collectorZone: string;

    damageLevel: string;

    repairOperations: RepairOperation[];

    currentStage: number;
    currentSubstage: number;
    currentStageStatus: number;
}

export interface SaveSkivingApprovalPayload {
    orderCasingIds: number[];

    isApproved: boolean;

    isRepeatSkiving: boolean;

    rejectionReasonCode: string | null;

    skipRepair: boolean;
}