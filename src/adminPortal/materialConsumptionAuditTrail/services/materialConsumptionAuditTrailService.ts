
import api from "../../../shared/services/api";

const materialConsumptionAuditTrailService = {
  getRequests: (pageNumber: number, pageSize: number) =>
    api.get("/sap/material-consumption/requests", {
      params: {
        pageNumber,
        pageSize,
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
