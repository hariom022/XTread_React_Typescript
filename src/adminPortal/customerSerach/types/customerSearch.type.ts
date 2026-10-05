export interface Customer {
  customerNumber: string;
  customerName: string;
  searchTerm: string | null;

  companyCode: string | null;

  salesGroup: string | null;
  salesGroupDescription: string | null;

  customerGroup: string | null;
  customerGroupDescription: string | null;

  mobileNumber: string | null;

  priceList: string | null;
  priceListDescription: string | null;

  address1: string | null;
  address2: string | null;

  city: string | null;
  country: string | null;
  pincode: string | null;

  email: string | null;
}

export interface CustomerSearchRequest {
  sapNumber: string;
  customerName: string;
}

export interface CustomerSearchApiResponse {
  success: boolean;
  data: {
    customers: Customer[];
  } | null;
  error: {
    code: string;
    message: string;
    details: string | null;
  } | null;
}

export interface SaveCustomerResponse {
  success: boolean;
  message: string;
  data?: Customer;
}