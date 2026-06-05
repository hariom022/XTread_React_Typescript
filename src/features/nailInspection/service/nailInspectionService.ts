import api from "../../../shared/services/api";
const nailInspectionService = {

  // getNailInspectionOrders: (params = {}) =>
  //   api.get(`/orders`, {
  //     params: {
  //       ...params,
  //       currentStage: 4,
  //       currentStageStatus: 1,
  //     },
  //   }),

  // 🔹 Create Nail Inspection
  createNailInspection: (data:any) =>
    api.post(`/nail-inspection/casings`, data),

  // 🔹 Rejection Reasons
  getRejectionReason: () =>
    api.get(`/rejection-reasons?currentStage=${4}`),

  // 🔹 Approve / Reject
  handleApprovalRejection: (data:any) =>
    api.post(`/nail-inspection/approve-reject`, data),
};
export default nailInspectionService