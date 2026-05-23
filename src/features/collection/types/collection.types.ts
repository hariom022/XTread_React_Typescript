export interface RimSize {
  rimSize: string;
}

export interface TyreSize {
  id: number;
  casingSize: string;
}

export interface TyreMake {
  tyreMakeId: number;
  tyreMakeName: string;
  tyreClassificationId: number;
  tyreClassificationName: string;
}

export interface PatternVariant {
  treadPatternVariantId: number;
  width: number;
}

export interface Pattern {
  treadPatternId: number;
  patternName: string;
  brand: string;
  tyreClassificationName: string;
  variants: PatternVariant[];
}

export interface TyreHistory {
  invoiceDate: string;
  invoiceNo: string;
  invoiceAmount: string;
  previousPattern: string;
  repairMaterial: string;
  serviceType: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface ServiceType {
  serviceTypeId: number;
  serviceTypeName: string;
}

export interface Customer {
  customerNumber: string;
  customerName: string;
  mobileNumber?: string;
  email?: string;
  salesGroupDescription?: string;
}

export interface OrderItem {
  id: number;

  serviceType: string;

  category: string;

  tyreSize: string;

  serial: string;

  dot: string;

  make?: string;

  model?: string;

  pattern?: string;

  width?: string;

  vehicleReg?: string;

  noOfRepairs?: string;

  casingSize: string;

  
}