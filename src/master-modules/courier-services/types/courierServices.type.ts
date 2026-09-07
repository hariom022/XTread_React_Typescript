export interface CourierService {
  courierServiceId: number;
  courierName: string;
  courierType: number;
  code: string | null;
  contactPerson: string | null;
  contactNumber: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean;
}

export interface CreateCourierServiceRequest {
  courierName: string;
  courierType: number;
  code: string | null;
  contactPerson: string;
  contactNumber: string | null;
  email: string | null;
  address: string;
}

export interface UpdateCourierServiceRequest {
  courierName: string;
  courierType: number;
  code: string | null;
  contactPerson: string;
  contactNumber: string | null;
  email: string | null;
  address: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}