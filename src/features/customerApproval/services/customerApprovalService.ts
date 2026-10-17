import api from "../../../shared/services/api";

const customerApprovalService = {
  getCollectionOrders: (params = {}) =>
    api.get("/orders", {
      params: {
        ...params,
        currentStage: 1,
        currentStageStatus: 1,
      },
    }),

  confirmCustomerOrder: (data: CustomerApprovalPayload) =>
    api.post("/orders/customer-approval", data),

  deleteCasing: (
    orderNumber: string,
    orderCasingId: number
  ) =>
    api.delete(
      `/orders/${orderNumber}/casings/${orderCasingId}`
    ),
};

export default customerApprovalService;


export interface CustomerApprovalOrderPayload {
  orderId: number;
  requiresLpo: boolean;
  requiresPayment: boolean;
}

export interface CustomerApprovalPayload {
  orders: CustomerApprovalOrderPayload[];
  customerRepresentative: string;
  phoneNumber: string;
  emailAddresses: string[];
  casingCondition: string;
  remarks: string | null;
  customerSignature: string;
}


