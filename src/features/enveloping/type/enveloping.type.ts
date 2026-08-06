export interface EnvelopingRow {
  orderCasingId: number;

  lineNumber: number;

  productionNumber: string;

  batchNumber: string;

  tyreReferenceNumber: string;

  customerName: string;

  orderDate: string;

  patternName: string;

  serviceTypeName: string;

  categoryName: string;

  currentStage: number;

  currentStageStatus: number;

  currentSubstage: number | null;

  railLocation?: string;

  railNo?: number;
  railId?: number;
  railPipeId?: number;
  railName: string;
  railPipeName:string;
}

export interface AllocatedRailRow
  extends EnvelopingRow {
  railLocation: string;

  railNo: number;
}

// export type RailType =
//   | "Marangoni"
//   | "Elgi";

  export interface Rail {
  railId: number;
  name: string;
  sortOrder: number;
}
export interface RailPipe {
  railPipeId: number;
  railId: number;
  pipeName: string;
  isActive: boolean;
  sortOrder: number;
}

