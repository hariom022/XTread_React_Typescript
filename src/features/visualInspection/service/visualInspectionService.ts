
import api from "../../../shared/services/api";
const visualInspectionService = {
  createVisualInspection: (data:any) =>
    api.post(`/visual-inspection/casings`, data),

  getRejectionReason:()=>
    api.get(`rejection-reasons?currentStage=${3}`),

  handleApprovalRejection:(data:any)=>
    api.post("visual-inspection/approve-reject", data)
};

export default visualInspectionService;