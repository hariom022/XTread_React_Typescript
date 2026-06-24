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
}

export interface CustomerCasing {
  casing: string;
  serial: string;
  size: string;
  service: string;
}

export interface Customer {
  id: number;
  name: string;
  salesRep: string;
  casings: CustomerCasing[];
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