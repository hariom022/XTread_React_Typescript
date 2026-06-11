export interface PostBuffingRow {
 id: number;


  treadPatternId?: number;


  // Table Fields
  casing: string;
  serial: string;
  dot: string;

  customerName: string;

  tyreSize: string;

  tyreMake: string;     // ADD
  model: string;        // ADD
  brand: string;        // ADD
  width: string;        // ADD
  
  patternName: string;
  requestedPattern: string;

  date: string;

  service: string;

  batchNo: string;

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