export interface FillUpRow {
  id: number;

  orderCasingId: number;

  casing: string;

  serial: string;

  date: string;

  customerName: string;

  patternName: string;
  tyreMakeName: string;
  requestedPattern: string;
  reApprovedPattern?: string;

  tyreSize: string;

  service: string;

  batchNo: string;

  approved: number;

  rejected: number;

  pending: number;

  expectedTotal: number;

  originalBatch: any;

  originalCasing: any;
}
