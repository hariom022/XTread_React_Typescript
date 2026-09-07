import { apiRequest } from "../../../shared/services/apiClient";

import type {
  ApiResponse,
  CourierService,
  CreateDriverRequest,
  Driver,
  UpdateDriverRequest,
} from "../types/drivers.type";

/*
 * ==========================================================
 * GET COURIER SERVICES
 *
 * GET /courier-services?courierType=2
 * ==========================================================
 */

const getCourierServices = async (): Promise<
  CourierService[]
> => {
  const response =
    await apiRequest<ApiResponse<CourierService[]>>(
      "/courier-services?courierType=2"
    );

  if (!response.success) {
    throw new Error(
      response.error ||
        "Failed to fetch courier services."
    );
  }

  return response.data || [];
};

/*
 * ==========================================================
 * GET ALL DRIVERS
 *
 * GET /drivers?courierServiceId=1
 * ==========================================================
 */

const getDrivers = async (
  courierServiceId: number
): Promise<Driver[]> => {
  const response =
    await apiRequest<ApiResponse<Driver[]>>(
      `/drivers?courierServiceId=${courierServiceId}`
    );

  if (!response.success) {
    throw new Error(
      response.error ||
        "Failed to fetch drivers."
    );
  }

  return response.data || [];
};

/*
 * ==========================================================
 * GET DRIVER BY ID
 *
 * GET /drivers/:driverId
 * ==========================================================
 */

const getDriverById = async (
  driverId: number
): Promise<Driver> => {
  const response =
    await apiRequest<ApiResponse<Driver>>(
      `/drivers/${driverId}`
    );

  if (!response.success) {
    throw new Error(
      response.error ||
        "Failed to fetch driver details."
    );
  }

  return response.data;
};

/*
 * ==========================================================
 * CREATE DRIVER
 *
 * POST /drivers
 * ==========================================================
 */

const createDriver = async (
  request: CreateDriverRequest
): Promise<Driver> => {
  const response =
    await apiRequest<ApiResponse<Driver>>(
      "/drivers",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );

  if (!response.success) {
    throw new Error(
      response.error ||
        "Failed to create driver."
    );
  }

  return response.data;
};

/*
 * ==========================================================
 * UPDATE DRIVER
 *
 * PUT /drivers/:driverId
 * ==========================================================
 */

const updateDriver = async (
  driverId: number,
  request: UpdateDriverRequest
): Promise<Driver> => {
  const response =
    await apiRequest<ApiResponse<Driver>>(
      `/drivers/${driverId}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      }
    );

  if (!response.success) {
    throw new Error(
      response.error ||
        "Failed to update driver."
    );
  }

  return response.data;
};

/*
 * ==========================================================
 * DELETE DRIVER
 *
 * DELETE /drivers/:driverId
 * ==========================================================
 */

const deleteDriver = async (
  driverId: number
): Promise<void> => {
  const response =
    await apiRequest<ApiResponse<unknown>>(
      `/drivers/${driverId}`,
      {
        method: "DELETE",
      }
    );

  if (!response.success) {
    throw new Error(
      response.error ||
        "Failed to delete driver."
    );
  }
};

/*
 * ==========================================================
 * EXPORT
 * ==========================================================
 */

const driversApiService = {
  getCourierServices,
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};

export default driversApiService;