export interface QualityControlRow {
  orderCasingId: number;
  productionNumber: string;
  orderDate: string;
  tyreReferenceNumber: string;
  patternName: string;
  tyreSize: string;
  customerName: string;
  serviceTypeName: string;
  batchNumber?: string;
  reason?:string;
  
}

export interface QualityControlDetails
  extends QualityControlRow {
  requestedPattern?: string;
  approvedPattern?: string;
  approvedTreadWidth?: string;
  repairDetails?: any[];
  receivedDate:string;
}
// export interface QualityControlRequest {
//   orderCasingIds: number[];
//   isApproved: boolean | null;
//   isRepair: boolean | null;
//   isRecoverRubber: boolean | null;
//   isRubberRecoveryApproved: boolean | null;
//   isRejectedToDispatch: boolean | null;
//   rejectionReasonCode: string | null;
// }
export interface QualityControlRequest {
  orderCasingIds: number[];
  isApproved: boolean;
  destinationStage: number | null;
  isRecoverRubber: boolean | null;
  isRubberRecoveryApproved: boolean | null;
  rejectionReasonCode: string | null;
}
export interface RejectionReason {
  rejectionReasonId: number;
  casingStageId: number;
  casingSubstageId: number | null;
  code: string;
  reason: string;
  category: string | null;
  sortOrder: number;
};