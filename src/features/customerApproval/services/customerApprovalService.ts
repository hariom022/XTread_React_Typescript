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
      `/ orders / ${ orderNumber } /casings/${ orderCasingId } `
    ),
};

export default customerApprovalService;

export interface CustomerApprovalPayload {
  orderIds: string[];

  customerRepresentative: string;

  phoneNumber: string;

  emailAddress: string;

  casingCondition: string;

  remarks: string;

  customerSignature: string;
}

