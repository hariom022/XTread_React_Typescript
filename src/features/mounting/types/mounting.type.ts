export interface MountingRow {
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
  mountingSize :string;
 tyreSizeLabel:string;
  
}

export interface AllocatedMountingRow
  extends MountingRow {

  mountingSize: string;
}

  export interface MountingSize {
  mountingSizeId: number;
  mountingSize: string;
  sortOrder: number;
}