// export interface Customer {
//   customerNumber: string;
//   customerName: string;
//   searchTerm: string;
//   companyCode: string;
//   salesGroup: string;
//   salesGroupDescription: string;
//   customerGroup: string;
//   customerGroupDescription: string;
//   mobileNumber: string;
//   email: string | null;
//   priceList: string;
//   priceListDescription: string;
//   address1: string | null;
//   address2: string | null;
//   city: string | null;
//   country: string | null;
//   pincode: string | null;
//   createdOn: string;
//   modifiedOn: string | null;
//   lastSyncedOn: string | null;
//   lastSyncBatchId: string | null;
//   sourceSystem: string | null;
// }
export interface Customer {
  customerNumber: string;
  customerName: string;
  searchTerm?: string | null;
  companyCode?: string | null;
  salesGroup?: string | null;
  salesGroupDescription?: string | null;
  customerGroup?: string | null;
  customerGroupDescription?: string | null;
  mobileNumber?: string | null;
  email?: string | null;
  priceList?: string | null;
  priceListDescription?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  country?: string | null;
  pincode?: string | null;
  createdOn?: string | null;
  modifiedOn?: string | null;
  lastSyncedOn?: string | null;
  lastSyncBatchId?: string | null;
  sourceSystem?: string | null;
}

export interface Region {
  id: number;
  regionName: string;
  regionInitial: string;
}

export interface CustomerApiResponse {
  success: boolean;
  data: {
    items: Customer[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  error: string | null;
}

export interface RegionApiResponse {
  success: boolean;
  data: Region[];
  error: string | null;
}