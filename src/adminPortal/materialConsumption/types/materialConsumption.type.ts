export interface MaterialConsumption{
  orderCasingId:number;
  orderNumber:string;
  tyreReferenceNumber:string;
  productionNumber:string;
  batchNumber:string;
  barcodeNumber:string;
  currentStage:number;
  currentStageStatus:number;
  customerName:string;
  materialConsumed:MaterialConsumed[];
}

export interface MaterialConsumed{
  material:string;
  prodHierarchy4:string;
  consumptionType:number;
  quantity:string;
  unitOfMeasure:string;
  casingStageId:number;
  casingStageName:string;
  isApproved:boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}