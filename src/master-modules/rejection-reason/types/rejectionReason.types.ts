export interface RejectionReason {
  rejectionReasonId: number;
  casingStageId: number;
  casingSubstageId: number | null;
  code: string;
  reason: string;
  category: string | null;
  sortOrder: number;
}