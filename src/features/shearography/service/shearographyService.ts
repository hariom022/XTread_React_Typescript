import api from "../../../shared/services/api";
const shearographyService = {

  // 🔹 Get Orders
  getShearographyOrders: (params = {}) =>
    api.get(`/orders`, {
      params: {
        ...params,
        currentStage: 6,
        currentStageStatus: 1,
      },
    }),

  // 🔹 Rejection Reasons
  getRejectionReason: () =>
    api.get(`/rejection-reasons?currentStage=${6}`),

  // 🔹 Approve / Reject
  handleApprovalRejection: (data:any) =>
    api.post(
      `/shearography/approve-reject`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),

};

export default shearographyService;