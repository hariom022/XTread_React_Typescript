export interface OrderCasingDetails {
  orderCasingId: number;
  productionNumber: string;
  tyreReferenceNumber: string;
  customerName:string;
  tyreSize: {
    tyreSizeId: number;
    casingSize: string;
  };
  tyreMake: {
    id: number;
    name: string;
  };
  model: string;
  retreadDetail: {
    patternName: string;
    brand: string;
    width: number;
    treadPatternId: number;
    treadPatternVariantId: number;
  };
}