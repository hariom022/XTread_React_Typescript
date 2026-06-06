
import api from "../../../shared/services/api";
const pressureTestServiceApi = {


  // 🔹 Rejection Reasons
  getRejectionReason: () =>
    api.get(`/rejection-reasons?currentStage=${5}`),

  // 🔹 Approve / Reject
  handleApprovalRejection: (data:any) =>
    api.post(`/pressure-test/approve-reject`, data),

};

export default pressureTestServiceApi;