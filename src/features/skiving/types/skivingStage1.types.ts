export interface InspectionRepair {
  location: string;
  type: string;
  foundAt: string;
}

export interface SkivingRepair {
  location: string;
  type: string;
}

export interface SkivingStage1Row {
  id: number;

  casing: string;
  serial: string;
  date: string;

  customerName: string;

  tyreSize: string;
  tyreMake: string;

  model: string;
  brand: string;
  width: string;

  pattern: string;
  requestedPattern: string;
  reApprovedPattern?: string;

  service: string;
  batchNo: string;

  tyresCollected: number;
  tyresAvailable: number;

  collectorZone: string;

  damageLevel: string;

  inspectionRepairs: InspectionRepair[];

  currentStage?: number;
  currentSubstage?: number;
  currentStageStatus?: number;
}