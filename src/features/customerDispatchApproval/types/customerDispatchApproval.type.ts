// src/features/customerDispatchApproval/types/customerDispatchApproval.type.ts

export interface CustomerDispatchCasing {
  orderCasingId: number;
  lineNumber: number;

  tyreReferenceNumber: string;
  dotNumber: string;

  tyreSizeLabel: string;
  productionNumber: string;

  customerName: string;
  orderDate: string;

  patternName: string | null;
  tyreMakeName: string;

  serviceTypeName: string;
  categoryName: string;

  isTreadBenchDataCollected: boolean;

  currentStage: number;
  currentStageStatus: number;

  currentSubstage: number | null;

  railId: number | null;
  railName: string | null;

  railPipeId: number | null;
  railPipeName: string | null;

  autoclaveId: number | null;
  autoclaveName: string | null;

  autoclavePipeId: number | null;
  autoclavePipeName: string | null;

  moldId: number | null;
  moldName: string | null;
}

export interface CustomerDispatchBatchSummary {
  arrived: number;
  approved: number;
  rejected: number;
  pending: number;
  rejectedAtPreviousStages: number;
  expectedTotal: number;

  stillAtPreviousStage: number;

  isBatchFullyArrived: boolean;
  isCompleteAtPreviousStage: boolean;
  isBatchCompleteAtStage: boolean;
}

export interface CustomerDispatchBatch {
  batchNumber: string;

  originalBatchSize: number;

  stageSummary: CustomerDispatchBatchSummary;

  casings: CustomerDispatchCasing[];
}

export interface CustomerDispatchStage {
  stage: number;
  stageName: string;
  stageOrder: number;

  batches: CustomerDispatchBatch[];
}

export interface CustomerDispatchApiResponse {
  success: boolean;

  data: CustomerDispatchStage[];

  error: string | null;
}


/*
 * This is the row that will be displayed
 * in CustomerDispatchIndex.
 */
export interface CustomerDispatchOrderGroup {
  groupId: string;

  customerName: string;

  deliverySheetNo: string;
  orderNo: string;

  orderDate: string;

  totalCasings: number;

  casings: CustomerDispatchCasing[];

  batchNumbers: string[];
}


/*
 * Customer approval request payload that will be sent to the backend.
 */
export interface CustomerApprovalRequest {
  deliverySheetNo: string;
  casingIds: number[];
  customerRepresentative: string;
  mobileNumber: string;
  emailAddress: string;
  condition: string;
  remarks: string;
  signature: string;
}

export interface CustomerApprovalData {
  customerDispatchApprovalId: number;
  deliverySheetNo: string;
  customerRepresentative: string;
  mobileNumber: string;
  emailAddress: string;
  condition: string;
  remarks: string;
  signatureFileName: string;
  signatureContentType: string;
  createdAtUtc: string;
  casingIds: number[];
}

export interface CustomerApprovalResponse {
  success: boolean;
  data: CustomerApprovalData | null;
  error: string | null;
}