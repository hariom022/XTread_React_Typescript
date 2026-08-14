export type ChamberType = "MARANGONI AUTOCLAVE VT24" | "ELGI AUTOCLAVE";

export interface CuringRow {
  orderCasingId: number;

  autoclaveId?: number;

  autoclavePipeId?: number;

  productionNumber: string;

  tyreReferenceNumber: string;

  orderDate: string;

  batchNumber: string;

  patternName: string;

  serviceTypeName: string;

  pipeNo?: number;

  comment?: string;

  chamber?: string;
  autoclavePipeName?:string;
  tyreSizeLabel:string;
}

export interface AllocatedPipeRow extends CuringRow {
  autoclaveId: number;
 autoclavePipeId: number;
  pipeName: string;
}

export interface AutoclavePipe {
  autoclavePipeId: number;
  autoclaveId: number;
  pipeName: string;
  isActive: boolean;
  sortOrder: number;
  
}
