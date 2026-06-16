export type ChamberType =
  | "MARANGONI AUTOCLAVE VT24"
  | "ELGI AUTOCLAVE";

export interface CuringRow {
  orderCasingId: number;

  productionNumber: string;

  tyreReferenceNumber: string;

  orderDate: string;

  batchNumber: string;

  patternName: string;

  serviceTypeName: string;

  pipeNo?: number;

  comment?: string;

  chamber?: string;
}

export interface AllocatedPipeRow
  extends CuringRow {
  chamber:
    | ChamberType
    | "";

  pipeNo: number;
}