export interface Customer {
  customerNumber: string;
  customerName: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface ServiceType {
  id: number;
  name: string;
}

export interface TyreMake {
  id: number;
  name: string;
}

export interface TyreSize {
  tyreSizeId: number;
  casingSize: string;
}

export interface RetreadDetail {
  patternName: string;
  width: number;
}

export interface RepairOperation {
  repairType: string;
  repairLocation: string;
  quantity: number;
}

export interface RepairDetail {
  percentageRemainingTreadDepth: number;
  operations: RepairOperation[];
}

export interface Casing {
  orderCasingId: number;
  orderNumber:string;
  tyreReferenceNumber: string;
  otherNumber: string;
  dotNumber: string;

  model: string;

  rimSize: string;

  noOfRetread: number;

  previousPattern: string;
  previousRetreader: string;

  vehicleRegistrationNumber: string;

  existingRepairsCount: number;

  productionNumber?: string;
  batchNumber?: string;
  barcodeNumber?: string;

  serviceType?: ServiceType;

  category?: Category;

  tyreMake?: TyreMake;

  tyreSize?: TyreSize;

  tyreClassification?: {
    id: number;
    name: string;
  };

  retreadDetail?: RetreadDetail;

  repairDetail?: RepairDetail;
}

export interface Order {
  orderNumber: string;

  createdAtUtc: string;

  customer: Customer;

  casings: Casing[];
}

export interface ReceivingRow {
  id: number;

  originalCasing: Casing;

  orderNo: string;

  customerId: string;

  customerName: string;

  date: string;

  tyreReferenceNumber: string;

  otherNumber: string;

  dotNo: string;

  casingSize: string;

  treadPattern: string;

  treadWidth: string | number;

  make: string;

  model: string;

  serviceType: string;

  rimSize: string;

  tyreClassification: string;

  existingRepairsCount: number;

  numberOfRetreads: number | string;

  previousRetreaded: string;

  previousPattern: string;

  customerVehicleRegNo: string;

  category: Category | null;

  categoryName: string;

  damageType: string;

  repairLocation: string;

  repairQty: string;

  remainingTreadDepth: string | number;

  productionNo?: string;

  batchNo?: string;

  barcodeNumber?: string;

  casingNo?: string;

  comments?: string;
}