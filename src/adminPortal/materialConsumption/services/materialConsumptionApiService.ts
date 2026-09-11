import { apiRequest } from "../../../shared/services/apiClient";

import type {
  ApiResponse,
  MaterialConsumptionPagedResponse,
} from "../types/materialConsumption.type";

/*
 * ==========================================================
 * GET MATERIAL CONSUMPTION APPROVALS
 * ==========================================================
 */

const getMaterialConsumptionApprovals = async (
  pageNumber: number,
  pageSize: number
): Promise<MaterialConsumptionPagedResponse> => {
  const response =
    await apiRequest<ApiResponse<MaterialConsumptionPagedResponse>>(
      `/sap/material-consumption/quality-control-approved?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

  if (!response.success) {
    throw new Error(
      response.error ||
        "Failed to fetch Material Consumption."
    );
  }

  return (
    response.data || {
      items: [],
      pageNumber,
      pageSize,
      totalCount: 0,
      totalPages: 0,
    }
  );
};

/*
 * ==========================================================
 * APPROVE MATERIAL CONSUMPTION
 * ==========================================================
 */

const approveMaterialConsumption = async (
  orderCasingId: number
): Promise<void> => {
  const response =
    await apiRequest<ApiResponse<unknown>>(
      `/sap/material-consumption/${orderCasingId}/approve`,
      {
        method: "POST",
      }
    );

  if (!response.success) {
    throw new Error(
      response.error ||
        "Failed to approve Material Consumption."
    );
  }
};

const materialConsumptionApiService = {
  getMaterialConsumptionApprovals,
  approveMaterialConsumption,
};

export default materialConsumptionApiService;