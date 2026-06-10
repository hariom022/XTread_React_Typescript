export interface InspectionRepair {
  location: string;
  type: string;
  foundAt: string;
}

export interface SkivingRepair {
  location: string;
  type: string;
}

export interface skivingStage1Row {
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

  inspectionRepairs: InspectionRepair[];

  currentStage: number;
  currentSubstage: number;
  currentStageStatus: number;
}

export interface Machine {
  machineId: number;
  machineName: string;
}

export interface SaveSkivingStage1Payload {
  orderCasingIds: number[];

  isApproved: boolean;

  machineId: string;

  rejectionReasonCode: string | null;

  repairOperations: {
    repairType: string;
    repairLocation: string;
    quantity: number;
  }[];
}