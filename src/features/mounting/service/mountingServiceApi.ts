import api from "../../../shared/services/api";

const mountingServiceApi = {
  /* ==========================
      INDEX PAGE DATA
  ========================== */

  getmountingOrders: () =>
    api.get(
      "/batches/progress?currentStage=17&currentStageStatus=1"
    ),

  getMountingOrdersLoaded: () =>
    api.get(
      "/batches/progress?currentStage=17&currentStageStatus=5"
    ),

  /* ==========================
      MOUNTING ASSIGN
  ========================== */

  assignMounting(payload: {
    orderCasingIds: number[];
  }) {
    return api.post("/mounting/assign", payload);
  },

  /* ==========================
      APPROVE / REJECT MOUNTING
  ========================== */

  approveRejectMounting(payload: {
    isApproved: boolean;
    rejectionReasonId: number | null;
    orderCasingIds: number[];
  }) {
    return api.post(
      "/mounting/approve-reject",
      payload
    );
  },
};

export default mountingServiceApi;