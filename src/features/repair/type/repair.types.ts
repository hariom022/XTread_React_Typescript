export interface RepairRow {
   id: number;
 
   casing: string;
   serial: string;
   date: string;
 
   customerName: string;
 
   tyreSize: string;
   tyreMake: string;
 
   model: string;
   brand: string;
   width: string;
 
   patternName: string;
   requestedPattern: string;
   reApprovedPattern?: string;
 
   service: string;
   batchNo: string;
 
   tyresCollected: number;
   tyresAvailable: number;
 
   collectorZone: string;
 
   damageLevel: string;
 
  //  repairOperations: RepairOperation[];
 
   currentStage?: number;
   currentSubstage?: number;
   currentStageStatus?: number;
   // Batch Summary
   approved?: number;
   rejected?: number;
   pending?: number;
   previousStage?: number;
   expectedTotal?: number;
   arrived?: number;
 
    // Modal Fields
   isRetreaded?: boolean;
 
   previousPattern?: string;
   previousRetreader?: string;
 
   noOfRetread?: number;
   noOfExistingRepairs?: number;
 
   originalBatch?: any;
   originalCasing?: any;
}

export interface RepairModalData {
  orderCasingId: number;

  productionNumber: string;

  tyreReferenceNumber: string;

  customerName: string;

  model: string;

  serviceType: {
    id: number;
    name: string;
  };

  tyreSize: {
    tyreSizeId: number;
    casingSize: string;
  };

  tyreMake: {
    id: number;
    name: string;
  };

  retreadDetail?: {
    treadPatternVariantId: number;
    patternName: string;
    brand: string;
    width: number;
    treadPatternId: number;
  };

  repairDetail: any;
}

export interface InspectionRepair {
  location: string;
  type: string;
  material: string;
  foundAt: string;
}

export interface RepairPatch {
  id: number;

  location: string;

  damageType: string;

  patchType: string;

  patchSize: string;
}

export interface DamagePatch {
  id: number;

  patchType: string;

  patchSize: string;
}