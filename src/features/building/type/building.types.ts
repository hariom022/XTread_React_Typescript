export interface BuildingRow {
    id: number;

    orderCasingId: number;

    casing: string;

    serial: string;

    date: string;

    customerName: string;

    patternName: string;
    tyreMakeName: string;

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

export interface Materials{
 materialNumber:string;
 materialDescription:string;
 materialType:string;
 materialTypeDesc:string;
 materialGroup:string;
 materialGroupDesc:string;
 prodHierarchy1:string;
 description1:string;
 prodHierarchy2:string;
 description2:string;
 prodHierarchy3:string;
 description3:string;
 prodHierarchy4:string;
 description4:string;
 sizePattern:string;
 additionalDescription:string;
}