
import api from "../../../shared/services/api";

const materialConsumptionAuditTrailService = {
  getRequests: (
  pageNumber: number,
  pageSize: number,
  filters?: {
    Search?: string;
    Statuses?: number[];
    Status?: number;
    CustomerNumber?: string;
    OrderNumber?: string;
    CustomerName?: string;
    ProductionNumber?: string;
  }
) =>
  api.get("/sap/material-consumption/requests", {
    params: {
      pageNumber,
      pageSize,
      Search: filters?.Search || undefined,
      Statuses: filters?.Statuses?.length
        ? filters.Statuses
        : undefined,
      Status: filters?.Status || undefined,
      CustomerNumber: filters?.CustomerNumber || undefined,
      OrderNumber: filters?.OrderNumber || undefined,
      CustomerName: filters?.CustomerName || undefined,
      ProductionNumber: filters?.ProductionNumber || undefined,
    },
    paramsSerializer: {
      indexes: null,
    },
  }),
    // Get individual request details and SAP attempt history
  getRequestDetails: (requestId: number) =>
    api.get(`/sap/material-consumption/requests/${requestId}`),

  getRequestAttempts: (requestId: number) =>
  api.get(
    `/sap/material-consumption/requests/${requestId}/attempts`
  ),

  // Get original SAP request payload
  getOriginalRequestPayload: (requestId: number) =>
    api.get(
      `/sap/material-consumption/requests/${requestId}/payload`
    ),

    // Get one attempt's request and response payloads
  getAttemptPayload: (
    requestId: number,
    attemptId: number
  ) =>
    api.get(
      `/sap/material-consumption/requests/${requestId}/attempts/${attemptId}/payload`
    ),
};

export default materialConsumptionAuditTrailService;
