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
  tyreMakeName:string;

  tyreSize: string;
  tyreMake: string;

  model: string;
  brand: string;
  width: string;

  patternName: string;
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
  // Batch Summary
  approved?: number;
  rejected?: number;
  pending?: number;
  previousStage?: number;
  expectedTotal?: number;
  arrived?: number;

   // Modal Fields
  isRetreaded?: boolean;

  previousPattern?: string;
  previousRetreader?: string;

  noOfRetread?: number;
  noOfExistingRepairs?: number;

  originalBatch?: any;
  originalCasing?: any;

}