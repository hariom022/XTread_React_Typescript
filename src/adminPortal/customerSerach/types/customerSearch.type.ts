export interface Customer {
  id: number;

  customerNumber: string;
  customerName: string;

  mobileNumber: string;

  sapNumber: string;

  address1: string;
  address2: string | null;

  city: string;
  country: string;
  pincode: string;

  email: string | null;

  companyCode: string;
  salesGroup: string;
  salesGroupDescription: string;

  customerGroup: string;
  customerGroupDescription: string;

  priceList: string;
  priceListDescription: string | null;
}

export interface CustomerSearchRequest {
  sapNumber: string;
  customerName: string;
}

export interface CustomerSearchApiResponse {
  success: boolean;

  data: {
    customers: CustomerApiResponse[];
  };

  error: string | null;
}

export interface CustomerApiResponse {
  customerNumber: string;
  customerName: string;

  searchTerm: string | null;

  companyCode: string;
  salesGroup: string;
  salesGroupDescription: string;

  customerGroup: string;
  customerGroupDescription: string;

  mobileNumber: string;

  priceList: string;
  priceListDescription: string | null;

  address1: string;
  address2: string | null;

  city: string;
  country: string;
  pincode: string;

  email: string | null;
}

export interface SaveCustomerResponse {
  success: boolean;
  message: string;
  data?: Customer;
}