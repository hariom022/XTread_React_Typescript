import { apiRequest } from "../../../shared/services/apiClient";

import type {
  CustomerApprovalRequest,
  CustomerDispatchApiResponse,
} from "../types/customerDispatchApproval.type";


const customerDispatchApprovalServiceApi = {

  /*
   * ==========================================================
   * GET DISPATCHED CASINGS
   * ==========================================================
   *
   * API:
   * /api/batches/progress?currentStage=16&currentStageStatus=2
   */

  async getDispatchedCasings(): Promise<CustomerDispatchApiResponse> {

    return await apiRequest<CustomerDispatchApiResponse>(
      "/batches/progress?currentStage=16&currentStageStatus=2"
    );

  },


  /*
   * ==========================================================
   * CUSTOMER APPROVAL
   * ==========================================================
   *
   * Approval API is not created yet.
   *
   * Currently using dummy response.
   */

  async approveCustomer(
    request: CustomerApprovalRequest
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    console.log(
      "Customer Approval Request:",
      request
    );


    /*
     * Dummy delay
     */

    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );


    return {
      success: true,
      message:
        "Customer approval completed successfully.",
    };

  },

};


export default customerDispatchApprovalServiceApi;