export interface Customer {
  id: number;
  customerName: string;
  mobileNumber: string;
  sapNumber: string;
  gpNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface CustomerSearchRequest {
  sapNumber: string;
  customerName: string;
}

export interface SaveCustomerResponse {
  success: boolean;
  message: string;
  data?: Customer;
}