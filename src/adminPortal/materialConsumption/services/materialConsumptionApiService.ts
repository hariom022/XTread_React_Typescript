
import { apiRequest } from "../../../shared/services/apiClient";
import type { ApiResponse, MaterialConsumption } from "../types/materialConsumption.type";


const getMaterialConsumptionApprovals = async (
): Promise<MaterialConsumption[]> => {
  const response =
    await apiRequest<ApiResponse<MaterialConsumption[]>>(
      '/sap/material-consumption/quality-control-approved'
    );

  if (!response.success) {
    throw new Error(
      response.error ||
        "Failed to fetch Material Consumption."
    );
  }

  return response.data || [];
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
approveMaterialConsumption
};

export default materialConsumptionApiService;