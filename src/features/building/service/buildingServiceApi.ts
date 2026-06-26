import api from "../../../shared/services/api";

const buildingServiceApi = {
  // Width dropdown depends on pattern
  getWidth: (treadPatternId: number) =>
    api.get(`/tread-patterns/${treadPatternId}/variants`),
  /**Approved Button API */
  // APPROVE 
  approveReject: (payload: {
    orderCasingIds: string[];
    isApproved: boolean;
    width: number | null;
    rejectionReasonCode: string | null;
  }) =>
    api.post(
      "/building/approve-reject",
      payload
    ),
  // RETURN TO REPAIR button api
  sendToRepair: (payload: {
    orderCasingIds: number[];
  }) =>
    api.post("/building/send-to-repair", payload),
    
};

export default buildingServiceApi;