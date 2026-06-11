export interface RepairOperation {
  repairType: string;
  repairLocation: string;
  quantity?: number;
}

export interface SkivingApprovalRow {
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

  repairOperations: RepairOperation[];

  currentStage?: number;
  currentSubstage?: number;
  currentStageStatus?: number;
}