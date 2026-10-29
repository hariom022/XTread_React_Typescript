
export interface Customer {
  customerNumber: string;
  customerName: string;
  searchTerm?: string;
  mobileNumber?: string | null;
  email?: string | null;
}

export interface Region {
  id: number;
  regionName: string;
  regionInitial: string;
}

export interface CustomerRegionMapping {
  customerNumber: string;
  customerName: string;
  regions: Region[];
}

export interface SaveCustomerRegionMappingRequest {
  regionIds: number[];
}
