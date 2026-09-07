import { apiRequest } from "../../../shared/services/apiClient";

import type {
  CustomerApprovalRequest,
  CustomerApprovalResponse,
  CustomerDispatchApiResponse,
} from "../types/customerDispatchApproval.type";

const customerDispatchApprovalServiceApi = {
  async getDispatchedCasings(): Promise<CustomerDispatchApiResponse> {
    return await apiRequest<CustomerDispatchApiResponse>(
      "/batches/progress?currentStage=16&currentStageStatus=2"
    );
  },

  async approveCustomer(
    request: CustomerApprovalRequest
  ): Promise<CustomerApprovalResponse> {
    return await apiRequest<CustomerApprovalResponse>(
      "/delivery-sheets/customer-approval",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  },
};

export default customerDispatchApprovalServiceApi;