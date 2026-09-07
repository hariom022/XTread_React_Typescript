export interface Driver {
  driverId: number;
  courierServiceId: number;
  driverName: string;
  driverIdNo: string;
  contactNumber: string | null;
  isActive: boolean;
}

/*
 * ==========================================================
 * COURIER SERVICE
 * ==========================================================
 */

export interface CourierService {
  courierServiceId: number;
  courierName: string;
  courierType: number;
  code: string;
  contactPerson: string | null;
  contactNumber: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean;
}

/*
 * ==========================================================
 * CREATE DRIVER
 * ==========================================================
 */

export interface CreateDriverRequest {
  courierServiceId: string;
  driverName: string;
  driverIdNo: string;
  contactNumber: string | null;
}

/*
 * ==========================================================
 * UPDATE DRIVER
 * ==========================================================
 */

export interface UpdateDriverRequest {
  driverName: string;
  driverIdNo: string;
  contactNumber: string;
  isActive: boolean;
}

/*
 * ==========================================================
 * GENERIC API RESPONSE
 * ==========================================================
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}