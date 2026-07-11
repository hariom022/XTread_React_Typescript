export interface PreBuffingRow {
  id: number;

  // Table Fields
  casing: string;
  serial: string;
  dot: string;

  customerName: string;

  tyreSize: string;

  patternName: string;
  requestedPattern: string;

  date: string;

  service: string;

  batchNo: string;
  tyreMakeName:string;

  // Batch Summary
  approved: number;
  rejected: number;
  pending: number;
  previousStage: number;
  expectedTotal: number;
  arrived: number;

  // Stage Info
  currentStageStatus: number;

  currentStage?: number;
  currentSubstage?: number;

  // Modal Fields
  isRetreaded: boolean;

  previousPattern: string;
  previousRetreader: string;

  noOfRetread: number;
  noOfExistingRepairs: number;

  originalBatch?: any;
  originalCasing?: any;
}