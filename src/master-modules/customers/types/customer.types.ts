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
  country: string | null;
  pincode: string | null;
  createdOn: string;
  modifiedOn: string | null;
  lastSyncedOn: string | null;
  lastSyncBatchId: string | null;
  sourceSystem: string | null;
}