export interface Customer {
  customerNumber: string;

  customerName: string;

  mobileNumber?: string;

  email?: string;

  salesGroupDescription?: string;
}

export interface TyreSize {
  casingSize: string;
}

export interface TyreMake {
  name: string;
}

export interface ServiceType {
  name: string;
}

export interface RetreadDetail {
  brand?: string;

  patternName?: string;
}

export interface Casing {
  orderCasingId: number;

  tyreReferenceNumber: string;

  otherNumber: string;

  dotNumber: string;

  isRetreaded: boolean;

  tyreSize?: TyreSize;

  tyreMake?: TyreMake;

  serviceType?: ServiceType;

  retreadDetail?: RetreadDetail;
}

export interface OrderItem {
  orderId: number;

  orderNumber: string;

  createdAtUtc: string;

  customer?: Customer;

  casings?: Casing[];
}