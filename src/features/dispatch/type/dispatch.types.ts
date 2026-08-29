export interface DispatchRow {
    id: number;
    date: string;
    deliveryNo: string;
    salesRep: string;
    customerName: string;
    courierName: string;
    driverName: string;
    vehicle?: string;
    status?: string;
    casings?: any[];
}


export interface Courier {
    id: number;
    name: string;
    vehicles: string[];
}


export interface ExistingCourier {
    id: number;
    name: string;
    regNo: string;
    driver: string;
}


export interface DispatchTeam {
    salesRep: string;
    courierName: string;
    regNo: string;
    driverName: string;
    driverId: string;
    courierServiceId :number;
}


export interface SalesRep {
    id: number;
    name: string;
    zone: string;
}


export interface ProductionSuccessData {
    customer?: string;
    deliveryNo: string;
}


export interface CustomerDeliveryPayload {
    customer?: string;
    deliveryNo: string;
    casings: CustomerCasing[];
}


export interface DispatchVerification {
    verified: boolean;
    printed: boolean;
    signed: boolean;
}


export interface DispatchFinalizationRow {
    id: number;
    date: string;
    deliveryNo: string;
    salesRep: string;
    customerName: string;
    courierName: string;
    driverName: string;
    zone: string;
    vehicle: string;
    status: string;
    casings?: CustomerCasing[];
}


export interface CourierService {
    courierServiceId: number;
    courierName: string;
    isActive: boolean;
}


export interface CourierVehicle {
    courierVehicleId: number;
    courierServiceId: number;
    vehicleRegNo: string;
    driverName: string;
    driverIdNo: string;
    isActive: boolean;
}


export interface AddCourierPayload {
    vehicleRegNo: string;
    driverName: string;
    driverIdNo: string;
}


export interface Customer {
    customerNumber: string;
    customerName: string;
    searchTerm: string;
    companyCode: string;
    salesGroup: string;
    salesGroupDescription: string;
    customerGroup: string;
    customerGroupDescription: string;
    mobileNumber: string;
    email: string | null;
    priceList: string;
    priceListDescription: string;
    address1: string | null;
    address2: string | null;
    city: string | null;
    country: string;
    pincode: string | null;
    createdOn: string;
    modifiedOn: string | null;
    lastSyncedOn: string | null;
    lastSyncBatchId: string | null;
    sourceSystem: string | null;
}


export interface ServiceType {
    serviceTypeId: number;
    serviceTypeName: string;
    serviceTypeCode: string;
}


/**
 * Customer casing coming from QC Batch API
 */
export interface CustomerCasing {
    orderCasingId: number;

    customerName: string;

    batchNo: string;

    productionNo: string;

    tyreSize: string;

    tyreMake: string;

    service: string;
}

export interface DeliverySheetPayload {
    orderCasingIds: number[];
    courierType: number;
    courierServiceId: number | string;
    courierName: string;
    vehicleRegNo: string;
    driverName: string;
    driverIdNo: string;
    remarks: string;
}