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