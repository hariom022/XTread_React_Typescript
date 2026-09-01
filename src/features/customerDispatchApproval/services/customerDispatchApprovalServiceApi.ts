import type {
  CustomerApprovalRequest,
  CustomerDispatchApprovalData,
} from "../types/customerDispatchApproval.type";

const customerDispatchApprovalServiceApi = {
  // Get order/customer/dispatch details
  async getCustomerApproval(
    orderNo?: string
  ): Promise<CustomerDispatchApprovalData> {
    // Dummy delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    return {
      orderNo: orderNo || "ORD-20260525-000006",

      customerName: "AARVI AUTO SERVICES (U) LTD",

      dispatchDate: "May 25, 2026",

      totalCasings: 1,

      items: [
        {
          tyreRefNo: "E100",
          otherNo: "E100",
          dotNo: "E100",
          isRetreaded: true,
          tyreSize: "12.00 R 20",
          make: "ADVANCE",
          brand: "ARCTIC",
          pattern: "RT9",
          serviceType: "Retread",
        },
      ],
    };
  },

  // Customer approval
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

    // Dummy delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    return {
      success: true,
      message:
        "Customer approval completed successfully.",
    };
  },
};

export default customerDispatchApprovalServiceApi;