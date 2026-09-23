
import { apiRequest } from "../../../shared/services/apiClient";

import type {
  ApiResponse,
  MaterialConsumptionPagedResponse,
} from "../types/materialConsumption.type";

/*
 * ==========================================================
 * GET MATERIAL CONSUMPTION APPROVALS
 * ==========================================================
 *
 * isApproved:
 * undefined = All
 * false     = Pending
 * true      = Approved
 */

const getMaterialConsumptionApprovals = async (
  pageNumber: number,
  pageSize: number,
  isApproved?: boolean
): Promise<MaterialConsumptionPagedResponse> => {
  const params = new URLSearchParams();

  params.append("pageNumber", pageNumber.toString());
  params.append("pageSize", pageSize.toString());

  /*
   * Only send isApproved when a specific status is selected.
   *
   * All     -> no isApproved parameter
   * Pending -> isApproved=false
   * Approved -> isApproved=true
   */
  if (isApproved !== undefined) {
    params.append("isApproved", isApproved.toString());
  }

  const response =
    await apiRequest<ApiResponse<MaterialConsumptionPagedResponse>>(
      `/sap/material-consumption/quality-control-approved?${params.toString()}`
    );

  if (!response.success) {
    throw new Error(
      response.error || "Failed to fetch Material Consumption."
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
  const response = await apiRequest<ApiResponse<unknown>>(
    `/sap/material-consumption/${orderCasingId}/approve`,
    {
      method: "POST",
    }
  );

  if (!response.success) {
    throw new Error(
      response.error || "Failed to approve Material Consumption."
    );
  }
};

/*
 * ==========================================================
 * UPDATE CONSUMED QUANTITY
 * ==========================================================
 */

const updateConsumedQuantity = async (
  orderCasingMaterialConsumptionId: number,
  consumedQuantity: number
): Promise<void> => {
  const response = await apiRequest<ApiResponse<unknown>>(
    `/sap/material-consumption/consumption/${orderCasingMaterialConsumptionId}/consumed-quantity`,
    {
      method: "PUT",
      body: JSON.stringify({
        consumedQuantity,
      }),
    }
  );

  if (!response.success) {
    throw new Error(
      response.error || "Failed to update consumed quantity."
    );
  }
};

const materialConsumptionApiService = {
  getMaterialConsumptionApprovals,
  approveMaterialConsumption,
  updateConsumedQuantity,
};

export default materialConsumptionApiService;

