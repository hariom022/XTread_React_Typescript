export interface CustomerDispatchItem {
  tyreRefNo: string;
  otherNo: string;
  dotNo: string;
  isRetreaded: boolean;
  tyreSize: string;
  make: string;
  brand: string;
  pattern: string;
  serviceType: string;
}

export interface CustomerDispatchApprovalData {
  orderNo: string;
  customerName: string;
  dispatchDate: string;
  totalCasings: number;
  items: CustomerDispatchItem[];
}

export interface CustomerApprovalRequest {
  orderNo: string;
  customerRepresentative: string;
  mobileNumber: string;
  emailAddress: string;
  condition: string;
  remarks: string;
  signature: string;
}