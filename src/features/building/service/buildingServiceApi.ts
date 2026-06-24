import api from "../../../shared/services/api";

const buildingServiceApi = {
  // Width dropdown depends on pattern
  getWidth: (treadPatternId: number) =>
    api.get(`/tread-patterns/${treadPatternId}/variants`),
  /**Approved Button API */
  // APPROVE / RETURN TO REPAIR
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
};

export default buildingServiceApi;